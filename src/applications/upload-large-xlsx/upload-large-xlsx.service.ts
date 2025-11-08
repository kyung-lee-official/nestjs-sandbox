import { BadRequestException, Injectable } from "@nestjs/common";
import { Response } from "express";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PrismaService } from "../../recipes/prisma/prisma.service";
import { ProcessFileJobData } from "./upload-large-xlsx.queue/interfaces";

@Injectable()
export class UploadLargeXlsxService {
	constructor(
		private prismaService: PrismaService,
		@InjectQueue("upload-xlsx-processing")
		private processingQueue: Queue
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

		/* Create a new task with pending status */
		const task = await this.prismaService.uploadLargeXlsxTask.create({
			data: {
				status: "PENDING",
				/* Will be updated after processing */
				totalRows: 0,
			},
		});

		/* Return immediately with task info */
		response.status(200).json({
			success: true,
			taskId: task.id,
			message: `Task created successfully. File will be processed asynchronously.`,
		});

		/* Queue file processing job asynchronously (don't await) */
		this.processingQueue.add("process-file", {
			taskId: task.id,
			fileBuffer: file.buffer,
			fileName: file.originalname,
		} as ProcessFileJobData);
	}

	async getTasks(page: number = 1) {
		const pageSize = 10;
		const skip = (page - 1) * pageSize;

		const tasks = await this.prismaService.uploadLargeXlsxTask.findMany({
			skip,
			take: pageSize,
			orderBy: { createdAt: "desc" },
		});
		return tasks;
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
