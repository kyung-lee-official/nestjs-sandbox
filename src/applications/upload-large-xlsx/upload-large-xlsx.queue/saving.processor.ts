import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "../../../recipes/prisma/prisma.service";
import { UploadLargeXlsxGateway } from "../upload-large-xlsx.gateway";
import { SaveChunkJobData } from "./interfaces";

@Processor("upload-xlsx-saving")
@Injectable()
export class UploadXlsxSavingProcessor extends WorkerHost {
	private readonly logger = new Logger(UploadXlsxSavingProcessor.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly gateway: UploadLargeXlsxGateway
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

		/* Update task progress */
		const updatedTask = await this.prismaService.uploadLargeXlsxTask.update(
			{
				where: { id: taskId },
				data: {
					savedRows: { increment: validData.length },
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
			const finalStatus =
				updatedTask.errorRows > 0 ? "HAS_ERRORS" : "COMPLETED";
			await this.prismaService.uploadLargeXlsxTask.update({
				where: { id: taskId },
				data: { status: finalStatus },
			});

			this.gateway.emitTaskProgress(taskId, {
				status: finalStatus,
				validationProgress: 100,
				savingProgress: 100,
				validatedRows: updatedTask.validatedRows,
				errorRows: updatedTask.errorRows,
				savedRows: updatedTask.savedRows,
			});
		}

		// this.logger.log(
		// 	`Completed saving chunk ${chunkIndex + 1}/${totalChunks} for task ${taskId}`
		// );
	}

	@OnWorkerEvent("completed")
	onCompleted(job: Job<SaveChunkJobData>) {
		this.logger.log(
			`Saving job ${job.id} completed for task ${job.data.taskId}`
		);
	}

	@OnWorkerEvent("failed")
	onFailed(job: Job<SaveChunkJobData>, error: Error) {
		this.logger.error(
			`Saving job ${job.id} failed for task ${job.data.taskId}:`,
			error
		);
	}
}
