import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bull";
import * as ExcelJS from "exceljs";
import { PrismaService } from "../../../recipes/prisma/prisma.service";
import { UploadLargeXlsxGateway } from "../upload-large-xlsx.gateway";
import { RedisStorageService } from "../services/redis-storage.service";
import { validateWorksheetHeaders } from "../../../utils/xlsx";
import {
	ProcessFileJobData,
	ProcessFileJobDataSchema,
	DbTaskStatusSchema,
	RedisProgressStatusSchema,
	ValidationError,
	TaskCompletionResult,
} from "../types";
import { ValidatingProcessor } from "./validating.processor";
import { SavingProcessor } from "./saving.processor";

@Injectable()
export class FileProcessingProcessor {
	private readonly logger = new Logger(FileProcessingProcessor.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly gateway: UploadLargeXlsxGateway,
		private readonly redisStorageService: RedisStorageService,
		private readonly validatingProcessor: ValidatingProcessor,
		private readonly savingProcessor: SavingProcessor
	) {}

	/* Main processing method called by Bull */
	async process(job: Job<ProcessFileJobData>): Promise<TaskCompletionResult> {
		/* Validate job data */
		const validatedData = ProcessFileJobDataSchema.parse(job.data);
		const { taskId, fileKey } = validatedData;

		try {
			/* Update task status to processing */
			await this.updateTaskStatus(
				taskId,
				DbTaskStatusSchema.enum.PROCESSING
			);

			/* Phase 1: Load workbook from Redis */
			/* Emit LOADING_WORKBOOK status without specific progress percentage */
			this.gateway.emitTaskProgress(taskId, {
				phase: RedisProgressStatusSchema.enum.LOADING_WORKBOOK,
			});

			const fileBuffer = await this.redisStorageService.getFile(fileKey);
			if (!fileBuffer) {
				throw new Error(`File not found in Redis for key: ${fileKey}`);
			}

			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.load(fileBuffer as any);

			const worksheet = workbook.getWorksheet(1);
			if (!worksheet) {
				throw new Error("No worksheet found in Excel file");
			}

			/* Phase 2: Validate headers */
			/* Emit VALIDATING_HEADERS status without specific progress percentage */
			this.gateway.emitTaskProgress(taskId, {
				phase: RedisProgressStatusSchema.enum.VALIDATING_HEADERS,
			});

			const columnMap = validateWorksheetHeaders(worksheet, [
				"Name",
				"Gender",
				"Bio-ID",
			]); /* Phase 3: Extract and validate data */
			/* Delegate to ValidatingProcessor which WILL emit real-time progress */
			const { validData, errors, totalRows } =
				await this.validatingProcessor.process(
					worksheet,
					columnMap,
					taskId,
					job
				);

			/* Update database with total rows */
			await this.prismaService.uploadLargeXlsxTask.update({
				where: { id: taskId },
				data: { totalRows },
			});

			/* Phase 4: Save valid data - delegate to SavingProcessor which WILL emit progress */
			const savedRows = await this.savingProcessor.process(
				validData,
				taskId,
				job
			);

			/* Save validation errors if any */
			if (errors.length > 0) {
				await this.saveValidationErrors(errors, taskId);
			}

			/* Determine final status */
			const finalStatus =
				errors.length > 0
					? DbTaskStatusSchema.enum.HAS_ERRORS
					: DbTaskStatusSchema.enum.COMPLETED;

			/* Update final task status and counts */
			await this.updateTaskCompletion(taskId, {
				status: finalStatus,
				totalRows,
				validatedRows: totalRows,
				errorRows: errors.length,
				savedRows,
			});

			/* Clean up Redis file */
			await this.redisStorageService.deleteFile(fileKey);

			/* Emit completion event */
			const result: TaskCompletionResult = {
				taskId,
				status: finalStatus,
				totalRows,
				validRows: validData.length,
				errorRows: errors.length,
				savedRows,
			};

			this.gateway.emitTaskCompleted(taskId, result);

			return result;
		} catch (error) {
			this.logger.error(`Task ${taskId} failed:`, error);

			/* Update task status to failed */
			await this.updateTaskStatus(taskId, DbTaskStatusSchema.enum.FAILED);

			/* Clean up Redis file on failure */
			await this.redisStorageService.deleteFile(fileKey);

			/* Emit failure event */
			this.gateway.emitTaskFailed(taskId, (error as Error).message);

			throw error;
		}
	}

	/* Save validation errors to database */
	private async saveValidationErrors(
		errors: ValidationError[],
		taskId: number
	): Promise<void> {
		if (errors.length === 0) return;

		await this.prismaService.uploadLargeXlsxError.createMany({
			data: errors.map((error) => ({
				taskId,
				rowNumber: error.rowNumber,
				errors: error.errors,
				rowData: error.rowData,
			})),
		});
	}

	/* Update task status in database */
	private async updateTaskStatus(
		taskId: number,
		status: string
	): Promise<void> {
		await this.prismaService.uploadLargeXlsxTask.update({
			where: { id: taskId },
			data: { status: status as any },
		});
	}

	/* Update task completion data */
	private async updateTaskCompletion(
		taskId: number,
		data: {
			status: string;
			totalRows: number;
			validatedRows: number;
			errorRows: number;
			savedRows: number;
		}
	): Promise<void> {
		await this.prismaService.uploadLargeXlsxTask.update({
			where: { id: taskId },
			data: {
				status: data.status as any,
				totalRows: data.totalRows,
				validatedRows: data.validatedRows,
				errorRows: data.errorRows,
				savedRows: data.savedRows,
			},
		});
	}
}
