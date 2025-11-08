import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "../../../recipes/prisma/prisma.service";
import { UploadLargeXlsxGateway } from "../upload-large-xlsx.gateway";
import { UploadLargeXlsxRedisService } from "../redis.service";
import { SaveChunkJobData } from "./interfaces";

@Processor("upload-xlsx-saving")
@Injectable()
export class UploadXlsxSavingProcessor extends WorkerHost {
	private readonly logger = new Logger(UploadXlsxSavingProcessor.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly gateway: UploadLargeXlsxGateway,
		private readonly uploadLargeXlsxRedisService: UploadLargeXlsxRedisService
	) {
		super();
	}

	async process(job: Job<SaveChunkJobData>): Promise<void> {
		const { taskId, validData, chunkIndex, totalChunks } = job.data;

		// this.logger.log(
		// 	`Processing saving chunk ${chunkIndex + 1}/${totalChunks} for task ${taskId}`
		// );

		/* Save chunk to database */
		await this.prismaService.uploadLargeXlsxData.createMany({
			data: validData.map((item) => ({
				...item,
				taskId,
			})),
		});

		/* Update task progress using Redis counters for atomic operations */
		const savedRowsCount =
			await this.uploadLargeXlsxRedisService.incrementSavedRows(
				taskId,
				validData.length
			);

		/* Update database with current progress and Redis counter values */
		const updatedTask = await this.prismaService.uploadLargeXlsxTask.update(
			{
				where: { id: taskId },
				data: {
					savedRows: savedRowsCount,
					savingProgress: ((chunkIndex + 1) / totalChunks) * 100,
				},
			}
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

		/* If this is the last saving chunk, mark task as completed */
		if (chunkIndex === totalChunks - 1) {
			/* Get final accurate counts from Redis before completing */
			const finalCounters =
				await this.uploadLargeXlsxRedisService.getTaskCounters(taskId);

			const finalStatus =
				finalCounters.errorRows > 0 ? "HAS_ERRORS" : "COMPLETED";

			/* Final update with accurate counts */
			const finalTask =
				await this.prismaService.uploadLargeXlsxTask.update({
					where: { id: taskId },
					data: {
						status: finalStatus,
						validatedRows: finalCounters.validatedRows,
						savedRows: finalCounters.savedRows,
						errorRows: finalCounters.errorRows,
					},
				});

			this.gateway.emitTaskProgress(taskId, {
				status: finalStatus,
				validationProgress: 100,
				savingProgress: 100,
				validatedRows: finalTask.validatedRows,
				errorRows: finalTask.errorRows,
				savedRows: finalTask.savedRows,
			});

			/* Clean up Redis counters after completion */
			await this.uploadLargeXlsxRedisService.cleanupTaskData(taskId);
		}

		// this.logger.log(
		// 	`Completed saving chunk ${chunkIndex + 1}/${totalChunks} for task ${taskId}`
		// );
	}

	@OnWorkerEvent("completed")
	onCompleted(job: Job<SaveChunkJobData>) {
		// this.logger.log(
		// 	`Saving job ${job.id} completed for task ${job.data.taskId}`
		// );
	}

	@OnWorkerEvent("failed")
	onFailed(job: Job<SaveChunkJobData>, error: Error) {
		this.logger.error(
			`Saving job ${job.id} failed for task ${job.data.taskId}:`,
			error
		);
	}
}
