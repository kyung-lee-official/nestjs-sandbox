import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { PrismaService } from "../../../recipes/prisma/prisma.service";
import { CreateUploadLargeXlsxSchema } from "../dto/create-upload-large-xlsx.dto";
import { UploadLargeXlsxGateway } from "../upload-large-xlsx.gateway";
import {
	ValidateChunkJobData,
	SaveChunkJobData,
	UploadLargeXlsxRowData,
} from "./interfaces";

@Processor("upload-xlsx-validation")
@Injectable()
export class UploadXlsxValidationProcessor extends WorkerHost {
	private readonly logger = new Logger(UploadXlsxValidationProcessor.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly gateway: UploadLargeXlsxGateway
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

		/* Update task progress and save errors if any */
		const updatedTask = await this.prismaService.uploadLargeXlsxTask.update(
			{
				where: { id: taskId },
				data: {
					validatedRows: { increment: chunk.length },
					errorRows: { increment: errors.length },
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

		/* Emit progress update */
		this.gateway.emitTaskProgress(taskId, {
			status: updatedTask.status,
			validationProgress: updatedTask.validationProgress,
			savingProgress: updatedTask.savingProgress,
			validatedRows: updatedTask.validatedRows,
			errorRows: updatedTask.errorRows,
			savedRows: updatedTask.savedRows,
		});

		/* If this is the last validation chunk and there's valid data, queue saving jobs */
		if (chunkIndex === totalChunks - 1 && validData.length > 0) {
			const allValidData = await this.getAllValidDataForTask(taskId);
			await this.queueSavingJobs(taskId, allValidData);
		}

		// this.logger.log(
		// 	`Completed validation chunk ${chunkIndex + 1}/${totalChunks} for task ${taskId}`
		// );
	}

	private async getAllValidDataForTask(
		taskId: number
	): Promise<Array<UploadLargeXlsxRowData>> {
		/* This is a simplified approach - in production, you might want to store valid data temporarily */
		/* For now, we'll re-validate to get clean data (this could be optimized) */
		const task = await this.prismaService.uploadLargeXlsxTask.findUnique({
			where: { id: taskId },
			include: { errors: true },
		});

		/* This is placeholder logic - you'd implement proper valid data collection here */
		return [];
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
		const savingQueue = this.gateway.getSavingQueue();
		for (let i = 0; i < chunks.length; i++) {
			await savingQueue.add("save-chunk", {
				taskId,
				validData: chunks[i],
				chunkIndex: i,
				totalChunks: chunks.length,
			} as SaveChunkJobData);
		}
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
