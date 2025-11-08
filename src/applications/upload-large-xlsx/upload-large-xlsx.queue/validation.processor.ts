import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "../../../recipes/prisma/prisma.service";
import { CreateUploadLargeXlsxSchema } from "../dto/create-upload-large-xlsx.dto";
import { UploadLargeXlsxGateway } from "../upload-large-xlsx.gateway";
import { UploadLargeXlsxQueueService } from "./upload-large-xlsx.queue";
import {
	ValidateChunkJobData,
	SaveChunkJobData,
	UploadLargeXlsxRowData,
} from "./interfaces";
import { UploadLargeXlsxRedisService } from "../redis.service";

@Processor("upload-xlsx-validation")
@Injectable()
export class UploadXlsxValidationProcessor extends WorkerHost {
	private readonly logger = new Logger(UploadXlsxValidationProcessor.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly gateway: UploadLargeXlsxGateway,
		private readonly queueService: UploadLargeXlsxQueueService,
		private readonly uploadLargeXlsxRedisService: UploadLargeXlsxRedisService
	) {
		super();
	}

	async process(job: Job<ValidateChunkJobData>): Promise<void> {
		const { taskId, chunk, chunkIndex, totalChunks } = job.data;

		// this.logger.log(
		// 	`Processing validation chunk ${chunkIndex + 1}/${totalChunks} for task ${taskId}`
		// );

		const validData: Array<UploadLargeXlsxRowData> = [];
		const errors: Array<{
			rowNumber: number;
			errors: string[];
			rowData: any;
		}> = [];

		/* Validate each row in the chunk */
		for (const { rowNumber, data } of chunk) {
			try {
				CreateUploadLargeXlsxSchema.parse(data);
				validData.push(data);
			} catch (error: any) {
				const errorMessages = error.issues?.map(
					(issue: any) => `${issue.path.join(".")}: ${issue.message}`
				) || [error.message];
				errors.push({
					rowNumber,
					errors: errorMessages,
					rowData: data,
				});
			}
		}

		/* Update task progress and save errors using Redis counters for atomic operations */
		const [validatedRowsCount, errorRowsCount] = await Promise.all([
			this.uploadLargeXlsxRedisService.incrementValidatedRows(
				taskId,
				chunk.length
			),
			this.uploadLargeXlsxRedisService.incrementErrorRows(
				taskId,
				errors.length
			),
		]);

		/* Update database with current progress and Redis counter values */
		const updatedTask = await this.prismaService.uploadLargeXlsxTask.update(
			{
				where: { id: taskId },
				data: {
					validatedRows: validatedRowsCount,
					errorRows: errorRowsCount,
					validationProgress: ((chunkIndex + 1) / totalChunks) * 100,
				},
			}
		);

		/* Save errors to database */
		if (errors.length > 0) {
			await this.prismaService.uploadLargeXlsxError.createMany({
				data: errors.map((error) => ({
					taskId,
					rowNumber: error.rowNumber,
					errors: error.errors,
					rowData: error.rowData,
				})),
			});

			/* Mark task as having errors if not already marked */
			if (
				updatedTask.status !== "HAS_ERRORS" &&
				updatedTask.status !== "FAILED"
			) {
				await this.prismaService.uploadLargeXlsxTask.update({
					where: { id: taskId },
					data: { status: "HAS_ERRORS" },
				});
			}
		}

		/* Save valid data to Redis for this chunk */
		if (validData.length > 0) {
			await this.uploadLargeXlsxRedisService.saveValidDataChunk(
				taskId,
				validData
			);
		}

		/* Mark this chunk as completed and check if all chunks are done */
		const allChunksCompleted =
			await this.uploadLargeXlsxRedisService.markChunkCompleted(
				taskId,
				chunkIndex,
				totalChunks
			);

		/* Emit progress update */
		this.gateway.emitTaskProgress(taskId, {
			status: updatedTask.status,
			validationProgress: updatedTask.validationProgress,
			savingProgress: updatedTask.savingProgress,
			validatedRows: updatedTask.validatedRows,
			errorRows: updatedTask.errorRows,
			savedRows: updatedTask.savedRows,
		});

		/* If all validation chunks are completed, queue saving jobs */
		if (allChunksCompleted) {
			const allValidData = await this.getAllValidDataForTask(taskId);
			if (allValidData.length > 0) {
				await this.queueSavingJobs(taskId, allValidData);
			} else {
				/* No valid data to save, mark as completed or failed based on errors */
				const finalStatus =
					updatedTask.errorRows > 0 ? "HAS_ERRORS" : "COMPLETED";
				await this.prismaService.uploadLargeXlsxTask.update({
					where: { id: taskId },
					data: { status: finalStatus },
				});

				/* Clean up Redis data */
				await this.uploadLargeXlsxRedisService.cleanupTaskData(taskId);
			}
		}

		// this.logger.log(
		// 	`Completed validation chunk ${chunkIndex + 1}/${totalChunks} for task ${taskId}`
		// );
	}

	private async getAllValidDataForTask(
		taskId: number
	): Promise<Array<UploadLargeXlsxRowData>> {
		/* Retrieve all valid data from Redis that was stored during validation */
		try {
			const allValidData =
				await this.uploadLargeXlsxRedisService.getAllValidData(taskId);
			// this.logger.debug(
			// 	`Retrieved ${allValidData.length} total valid records for task ${taskId}`
			// );
			return allValidData;
		} catch (error) {
			this.logger.error(
				`Failed to retrieve valid data for task ${taskId}:`,
				error
			);
			throw error;
		}
	}

	private async queueSavingJobs(
		taskId: number,
		validData: Array<UploadLargeXlsxRowData>
	) {
		/* Update task status to saving */
		await this.prismaService.uploadLargeXlsxTask.update({
			where: { id: taskId },
			data: { status: "SAVING" },
		});

		/* Chunk valid data for saving (1000 records per chunk) */
		const SAVE_CHUNK_SIZE = 1000;
		const chunks: Array<Array<UploadLargeXlsxRowData>> = [];

		for (let i = 0; i < validData.length; i += SAVE_CHUNK_SIZE) {
			chunks.push(validData.slice(i, i + SAVE_CHUNK_SIZE));
		}

		/* Queue saving jobs */
		for (let i = 0; i < chunks.length; i++) {
			const jobData: SaveChunkJobData = {
				taskId,
				validData: chunks[i],
				chunkIndex: i,
				totalChunks: chunks.length,
			};
			await this.queueService.addSavingJob(taskId, jobData);
		}

		/* Clean up Redis data after successfully queuing all saving jobs */
		await this.uploadLargeXlsxRedisService.cleanupTaskData(taskId);
		// this.logger.debug(
		// 	`Queued ${chunks.length} saving jobs and cleaned up Redis data for task ${taskId}`
		// );
	}

	@OnWorkerEvent("completed")
	onCompleted(job: Job<ValidateChunkJobData>) {
		this.logger.log(
			`Validation job ${job.id} completed for task ${job.data.taskId}`
		);
	}

	@OnWorkerEvent("failed")
	onFailed(job: Job<ValidateChunkJobData>, error: Error) {
		this.logger.error(
			`Validation job ${job.id} failed for task ${job.data.taskId}:`,
			error
		);
	}
}
