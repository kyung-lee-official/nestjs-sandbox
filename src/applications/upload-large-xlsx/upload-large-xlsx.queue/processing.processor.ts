import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "../../../recipes/prisma/prisma.service";
import { UploadLargeXlsxGateway } from "../upload-large-xlsx.gateway";
import { UploadLargeXlsxQueueService } from "./upload-large-xlsx.queue";
import * as ExcelJS from "exceljs";
import { validateWorksheetHeaders } from "src/utils/xlsx";
import { convertSerializedDataToBuffer } from "src/utils/bullmq";
import {
	ProcessFileJobData,
	ValidateChunkJobData,
	UploadLargeXlsxRowData,
} from "./interfaces";

@Processor("upload-xlsx-processing")
@Injectable()
export class UploadXlsxProcessingProcessor extends WorkerHost {
	private readonly logger = new Logger(UploadXlsxProcessingProcessor.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly gateway: UploadLargeXlsxGateway,
		private readonly queueService: UploadLargeXlsxQueueService
	) {
		super();
	}

	async process(job: Job<ProcessFileJobData>): Promise<void> {
		const { taskId, fileBuffer, fileName } = job.data;
		// this.logger.log(`Processing file ${fileName} for task ${taskId}`);
		try {
			/* Update status to loading workbook */
			await this.prismaService.uploadLargeXlsxTask.update({
				where: { id: taskId },
				data: { status: "LOADING_WORKBOOK" },
			});
			this.gateway.emitWorkbookLoadingStatus(taskId);

			/* Load workbook */
			const workbook = new ExcelJS.Workbook();
			const bufferToLoad = convertSerializedDataToBuffer(
				fileBuffer,
				fileName
				// this.logger
			);
			await workbook.xlsx.load(bufferToLoad as any);
			const worksheet = workbook.getWorksheet(1);
			if (!worksheet) {
				throw new Error("No worksheet found");
			}

			/* Update status to validating headers */
			await this.prismaService.uploadLargeXlsxTask.update({
				where: { id: taskId },
				data: { status: "VALIDATING_HEADERS" },
			});
			this.gateway.emitHeaderValidationStatus(taskId);
			/* Validate headers */
			const columnMap = validateWorksheetHeaders(worksheet, [
				"Name",
				"Gender",
				"Bio-ID",
			]);

			/* Extract all row data */
			const allRowData: Array<{
				rowNumber: number;
				data: UploadLargeXlsxRowData;
			}> = [];

			worksheet.eachRow((row, rowNumber) => {
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

			/* Update task with total rows and status */
			await this.prismaService.uploadLargeXlsxTask.update({
				where: { id: taskId },
				data: {
					status: "VALIDATING",
					totalRows: allRowData.length,
				},
			});
			this.gateway.emitProcessingCompleted(taskId, allRowData.length);
			/* Queue validation jobs */
			await this.queueValidationJobs(taskId, allRowData);
		} catch (error) {
			this.logger.error(
				`Error processing file for task ${taskId}:`,
				error
			);
			await this.prismaService.uploadLargeXlsxTask.update({
				where: { id: taskId },
				data: { status: "FAILED" },
			});
			this.gateway.emitTaskFailed(taskId, (error as Error).message);
		}
	}

	private async queueValidationJobs(
		taskId: number,
		allRowData: Array<{
			rowNumber: number;
			data: UploadLargeXlsxRowData;
		}>
	): Promise<void> {
		try {
			const VALIDATION_CHUNK_SIZE = 1000;
			const chunks: Array<
				Array<{
					rowNumber: number;
					data: UploadLargeXlsxRowData;
				}>
			> = [];

			/* Split data into chunks for parallel processing */
			for (let i = 0; i < allRowData.length; i += VALIDATION_CHUNK_SIZE) {
				chunks.push(allRowData.slice(i, i + VALIDATION_CHUNK_SIZE));
			}

			this.logger.log(
				`Queuing ${chunks.length} validation chunks for task ${taskId} (${allRowData.length} total rows)`
			);

			/* Queue validation jobs for each chunk */
			const queuePromises: Promise<Job>[] = [];
			for (let i = 0; i < chunks.length; i++) {
				const jobData: ValidateChunkJobData = {
					taskId,
					chunk: chunks[i],
					chunkIndex: i,
					totalChunks: chunks.length,
				};
				const queuePromise = this.queueService.addValidationJob(
					taskId,
					jobData
				);
				queuePromises.push(queuePromise);
			}

			/* Wait for all validation jobs to be queued */
			await Promise.all(queuePromises);

			this.logger.log(
				`Successfully queued ${chunks.length} validation jobs for task ${taskId}`
			);
		} catch (error) {
			this.logger.error(
				`Failed to queue validation jobs for task ${taskId}:`,
				error
			);

			/* Update task status to failed if we can't queue validation jobs */
			await this.prismaService.uploadLargeXlsxTask.update({
				where: { id: taskId },
				data: { status: "FAILED" },
			});

			this.gateway.emitTaskFailed(
				taskId,
				`Failed to queue validation jobs: ${(error as Error).message}`
			);

			throw error;
		}
	}
}
