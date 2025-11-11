import { z } from "zod";

/* Database task status definitions - persistent states stored in PostgreSQL */
export const ACTIVE_STATUSES = [
	"PENDING" /* Task created, not yet started processing */,
	"PROCESSING" /* Task is actively being processed (covers all intermediate steps) */,
] as const;

export const TERMINAL_STATUSES = [
	"COMPLETED" /* Successfully finished with no errors */,
	"HAS_ERRORS" /* Finished but some rows had validation errors */,
	"FAILED" /* Critical failure, task could not complete */,
] as const;

/* Helper functions for status checking */
export const isTerminalStatus = (status: DbTaskStatus): boolean => {
	return (TERMINAL_STATUSES as readonly string[]).includes(status);
};

export const isActiveStatus = (status: DbTaskStatus): boolean => {
	return (ACTIVE_STATUSES as readonly string[]).includes(status);
};

/* Database task status enum schema */
export const DbTaskStatusSchema = z.enum([
	...ACTIVE_STATUSES,
	...TERMINAL_STATUSES,
] as const);

export type DbTaskStatus = z.infer<typeof DbTaskStatusSchema>;

/* Redis progress status enum schema - detailed real-time states for active tasks */
export const RedisProgressStatusSchema = z.enum([
	"LOADING_WORKBOOK" /* Reading and parsing Excel file */,
	"VALIDATING_HEADERS" /* Checking column headers match expected format */,
	"VALIDATING" /* Processing and validating data rows */,
	"SAVING" /* Saving valid data to database */,
]);

export type RedisProgressStatus = z.infer<typeof RedisProgressStatusSchema>;

/* Progress metrics schema - numerical progress indicators */
export const TaskProgressMetricsSchema = z.object({
	totalRows: z.number().int().min(0).default(0),
	validatedRows: z.number().int().min(0).default(0),
	savedRows: z.number().int().min(0).default(0),
	errorRows: z.number().int().min(0).default(0),
	validationProgress: z.number().min(0).max(100).default(0),
	savingProgress: z.number().min(0).max(100).default(0),
});

export type TaskProgressMetrics = z.infer<typeof TaskProgressMetricsSchema>;

/* Excel row data validation schema */
export const UploadLargeXlsxRowDataSchema = z.object({
	name: z.string().min(1, "Name is required"),
	gender: z.string().min(1, "Gender is required"),
	bioId: z.string().min(1, "Bio ID is required"),
});

export type UploadLargeXlsxRowData = z.infer<
	typeof UploadLargeXlsxRowDataSchema
>;

/* Bull job data schema */
export const ProcessFileJobDataSchema = z.object({
	taskId: z.number().int().positive(),
	fileKey: z.string().min(1) /* Redis key for stored file */,
	fileName: z.string().min(1),
});

export type ProcessFileJobData = z.infer<typeof ProcessFileJobDataSchema>;

/* Validation error schema */
export const ValidationErrorSchema = z.object({
	rowNumber: z.number().int().positive(),
	errors: z.array(z.string()),
	rowData: z.any() /* Raw row data that failed validation */,
});

export type ValidationError = z.infer<typeof ValidationErrorSchema>;

/* Progress update event schema */
export const ProgressUpdateSchema = z.object({
	taskId: z.number().int().positive(),
	phase: RedisProgressStatusSchema,
	progress: z.number().min(0).max(100),
	metrics: TaskProgressMetricsSchema.partial(),
});

export type ProgressUpdate = z.infer<typeof ProgressUpdateSchema>;

/* Task schema */
export const TaskSchema = z.object({
	id: z.number().int().positive(),
	status: DbTaskStatusSchema,
	totalRows: z.number().int().min(0),
	validatedRows: z.number().int().min(0),
	errorRows: z.number().int().min(0),
	savedRows: z.number().int().min(0),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export type Task = z.infer<typeof TaskSchema>;

/* Redis key patterns */
export const REDIS_KEYS = {
	fileStorage: (taskId: number) => `upload:file:${taskId}`,
	taskProgress: (taskId: number) => `upload:progress:${taskId}`,
} as const;
