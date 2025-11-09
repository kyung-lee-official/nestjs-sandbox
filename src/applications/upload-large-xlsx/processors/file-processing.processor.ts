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
	UploadLargeXlsxRowDataSchema,
	ValidationError,
	TaskCompletionResult,
} from "../types";

@Injectable()
export class FileProcessingProcessor {
	private readonly logger = new Logger(FileProcessingProcessor.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly gateway: UploadLargeXlsxGateway,
		private readonly redisStorageService: RedisStorageService
	) {}

	/* Main processing method called by Bull */
	async process(job: Job<ProcessFileJobData>): Promise<TaskCompletionResult> {
		/* Validate job data */
		const validatedData = ProcessFileJobDataSchema.parse(job.data);
		const { taskId, fileKey, fileName } = validatedData;

		try {
			/* Update task status to processing */
			await this.updateTaskStatus(
				taskId,
				DbTaskStatusSchema.enum.PROCESSING
			);

			/* Phase 1: Load workbook from Redis */
			job.progress(0);
			await this.emitProgress(
				taskId,
				RedisProgressStatusSchema.enum.LOADING_WORKBOOK,
				0
			);

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
			job.progress(10);
			await this.emitProgress(
				taskId,
				RedisProgressStatusSchema.enum.VALIDATING_HEADERS,
				10
			);

			const columnMap = validateWorksheetHeaders(worksheet, [
				"Name",
				"Gender",
				"Bio-ID",
			]);

			/* Phase 3: Extract and validate data */
			job.progress(20);
			await this.emitProgress(
				taskId,
				RedisProgressStatusSchema.enum.VALIDATING,
				20
			);

			const { validData, errors, totalRows } =
				await this.validateWorksheetData(
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

			/* Phase 4: Save valid data */
			job.progress(50);
			await this.emitProgress(
				taskId,
				RedisProgressStatusSchema.enum.SAVING,
				50
			);

			const savedRows = await this.saveValidData(validData, taskId, job);

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
			job.progress(100);
			const result: TaskCompletionResult = {
				taskId,
				status: finalStatus,
				totalRows,
				validRows: validData.length,
				errorRows: errors.length,
				savedRows,
			};

			this.gateway.emitTaskCompleted(taskId, result);
			this.logger.log(
				`Task ${taskId} completed: ${savedRows} saved, ${errors.length} errors`
			);

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

	/* Extract and validate worksheet data in batches */
	private async validateWorksheetData(
		worksheet: ExcelJS.Worksheet,
		columnMap: Record<string, number>,
		taskId: number,
		job: Job
	) {
		const validData: any[] = [];
		const errors: ValidationError[] = [];
		const totalRows = worksheet.rowCount - 1; /* Exclude header row */
		const BATCH_SIZE = 1000;
		let processedRows = 0;

		/* Process rows in batches */
		for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
			const row = worksheet.getRow(rowNumber);

			const rowData = {
				name: row.getCell(columnMap["Name"]).text,
				gender: row.getCell(columnMap["Gender"]).text,
				bioId: row.getCell(columnMap["Bio-ID"]).text,
			};

			/* Validate row data using Zod */
			const result = UploadLargeXlsxRowDataSchema.safeParse(rowData);

			if (result.success) {
				validData.push(result.data);
			} else {
				/* Collect validation errors */
				const errorMessages = result.error.issues.map(
					(issue) => `${issue.path.join(".")}: ${issue.message}`
				);

				errors.push({
					rowNumber,
					errors: errorMessages,
					rowData,
				});
			}

			processedRows++;

			/* Update progress every batch */
			if (
				processedRows % BATCH_SIZE === 0 ||
				processedRows === totalRows
			) {
				const validationProgress =
					20 + (processedRows / totalRows) * 30; /* 20-50% range */
				job.progress(validationProgress);

				await this.emitProgress(
					taskId,
					RedisProgressStatusSchema.enum.VALIDATING,
					validationProgress,
					{
						totalRows,
						validatedRows: processedRows,
						errorRows: errors.length,
					}
				);
			}
		}

		return { validData, errors, totalRows };
	}

	/* Save valid data to database in batches */
	private async saveValidData(
		validData: any[],
		taskId: number,
		job: Job
	): Promise<number> {
		if (validData.length === 0) {
			return 0;
		}

		const BATCH_SIZE = 1000;
		let savedRows = 0;

		/* Save data in batches */
		for (let i = 0; i < validData.length; i += BATCH_SIZE) {
			const batch = validData.slice(i, i + BATCH_SIZE);

			/* Insert batch to database */
			await this.prismaService.uploadLargeXlsxData.createMany({
				data: batch.map((row) => ({
					taskId,
					name: row.name,
					gender: row.gender,
					bioId: row.bioId,
				})),
			});

			savedRows += batch.length;

			/* Update progress */
			const savingProgress =
				50 + (savedRows / validData.length) * 50; /* 50-100% range */
			job.progress(savingProgress);

			await this.emitProgress(
				taskId,
				RedisProgressStatusSchema.enum.SAVING,
				savingProgress,
				{
					savedRows,
				}
			);
		}

		return savedRows;
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

	/* Emit progress updates via WebSocket */
	private async emitProgress(
		taskId: number,
		phase: string,
		progress: number,
		metrics: any = {}
	): Promise<void> {
		this.gateway.emitTaskProgress(taskId, {
			phase,
			progress,
			...metrics,
		});
	}
}
