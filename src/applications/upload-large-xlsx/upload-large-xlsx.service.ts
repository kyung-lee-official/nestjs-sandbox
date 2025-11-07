import { BadRequestException, Injectable } from "@nestjs/common";
import { Response } from "express";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PrismaService } from "../../recipes/prisma/prisma.service";
import * as ExcelJS from "exceljs";
import { validateXlsxHeaders } from "src/utils/xlsx";
import { ValidateChunkJobData } from "./upload-large-xlsx.queue";
import { UploadLargeXlsxGateway } from "./upload-large-xlsx.gateway";

@Injectable()
export class UploadLargeXlsxService {
	constructor(
		private prismaService: PrismaService,
		private gateway: UploadLargeXlsxGateway,
		@InjectQueue("upload-xlsx-validation")
		private validationQueue: Queue
	) {}

	async uploadXlsx(file: Express.Multer.File, response: Response) {
		if (!file) {
			throw new BadRequestException("No file uploaded");
		}
		if (
			!file.mimetype.includes("spreadsheet") &&
			!file.originalname.endsWith(".xlsx")
		) {
			throw new BadRequestException("File must be an XLSX file");
		}

		/* Validate headers first */
		const columnMap = await validateXlsxHeaders(file.buffer, [
			"Name",
			"Gender",
			"Bio-ID",
		]);

		/* Load workbook and extract all row data */
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(file.buffer as any);
		const worksheet = workbook.getWorksheet(1);

		const allRowData: Array<{
			rowNumber: number;
			data: {
				name: string;
				gender: string;
				bioId: string;
			};
		}> = [];

		worksheet!.eachRow((row, rowNumber) => {
			/* Validate each row */
			if (rowNumber > 1) {
				const rowData = {
					name: row.getCell(columnMap["Name"]).text,
					gender: row.getCell(columnMap["Gender"]).text,
					bioId: row.getCell(columnMap["Bio-ID"]).text,
				};
				allRowData.push({
					rowNumber,
					data: rowData,
				});
			}
		});

		/* Create a new task with initial counts */
		const task = await this.prismaService.uploadLargeXlsxTask.create({
			data: {
				status: "VALIDATING",
				totalRows: allRowData.length,
			},
		});

		/* Return immediately with task info */
		response.status(200).json({
			success: true,
			taskId: task.id,
			totalRows: allRowData.length,
			message: `Task created successfully. Processing ${allRowData.length} rows asynchronously.`,
		});

		/* Queue validation jobs asynchronously (don't await) */
		this.queueValidationJobs(task.id, allRowData);
	}

	private async queueValidationJobs(
		taskId: number,
		allRowData: Array<{
			rowNumber: number;
			data: { name: string; gender: string; bioId: string };
		}>
	): Promise<void> {
		try {
			/* Chunk data for validation (1000 records per chunk) */
			const VALIDATION_CHUNK_SIZE = 1000;
			const chunks: Array<
				Array<{
					rowNumber: number;
					data: { name: string; gender: string; bioId: string };
				}>
			> = [];

			for (let i = 0; i < allRowData.length; i += VALIDATION_CHUNK_SIZE) {
				chunks.push(allRowData.slice(i, i + VALIDATION_CHUNK_SIZE));
			}

			/* Queue validation jobs */
			for (let i = 0; i < chunks.length; i++) {
				await this.validationQueue.add("validate-chunk", {
					taskId,
					chunk: chunks[i],
					chunkIndex: i,
					totalChunks: chunks.length,
				} as ValidateChunkJobData);
			}
		} catch (error) {
			console.error("Error queueing validation jobs:", error);

			/* Update task status to failed */
			try {
				await this.prismaService.uploadLargeXlsxTask.update({
					where: { id: taskId },
					data: { status: "FAILED" },
				});
			} catch (updateError) {
				console.error(
					"Error updating task status to FAILED:",
					updateError
				);
			}

			/* Emit failure event */
			this.gateway.emitTaskFailed(taskId, (error as Error).message);

			/* Re-throw to maintain error propagation if needed */
			throw error;
		}
	}

	async getTasks() {
		return this.prismaService.uploadLargeXlsxTask.findMany({
			include: {
				data: true,
				errors: true,
				_count: {
					select: {
						data: true,
						errors: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});
	}

	async getTaskById(taskId: number) {
		return this.prismaService.uploadLargeXlsxTask.findUnique({
			where: { id: taskId },
			include: {
				data: true,
				errors: true,
				_count: {
					select: {
						data: true,
						errors: true,
					},
				},
			},
		});
	}

	async deleteDataByTaskId(taskId: number) {
		/* Delete all data entries for this task */
		const deletedData =
			await this.prismaService.uploadLargeXlsxData.deleteMany({
				where: { taskId },
			});

		/* Delete all error entries for this task */
		const deletedErrors =
			await this.prismaService.uploadLargeXlsxError.deleteMany({
				where: { taskId },
			});

		/* Delete the task itself */
		await this.prismaService.uploadLargeXlsxTask.delete({
			where: { id: taskId },
		});

		return {
			success: true,
			deletedRecords: deletedData.count,
			deletedErrors: deletedErrors.count,
			message: `Task ${taskId} deleted successfully with ${deletedData.count} records and ${deletedErrors.count} errors`,
		};
	}
}
