import { z } from "zod";

/**
 * Database Status - Persistent states stored in PostgreSQL
 * These represent major lifecycle stages and are durable
 */
export const DbTaskStatusSchema = z.enum([
	"PENDING" /* Task created, not yet started processing */,
	"PROCESSING" /* Task is actively being processed (covers all intermediate steps) */,
	"COMPLETED" /* Successfully finished with no errors */,
	"HAS_ERRORS" /* Finished but some rows had validation errors */,
	"FAILED" /* Critical failure, task could not complete */,
]);

export type DbTaskStatus = z.infer<typeof DbTaskStatusSchema>;

/**
 * Redis Progress Status - Detailed real-time states stored in Redis
 * These provide granular progress information for active tasks
 */
export const RedisProgressStatusSchema = z.enum([
	"LOADING_WORKBOOK" /* Reading and parsing Excel file */,
	"VALIDATING_HEADERS" /* Checking column headers match expected format */,
	"VALIDATING" /* Processing and validating data rows */,
	"SAVING" /* Saving valid data to database */,
]);

export type RedisProgressStatus = z.infer<typeof RedisProgressStatusSchema>;

/**
 * Progress Metrics - Numerical progress indicators stored in Redis
 */
export const TaskProgressMetricsSchema = z.object({
	totalRows: z.number().int().min(0).default(0),
	validatedRows: z.number().int().min(0).default(0),
	savedRows: z.number().int().min(0).default(0),
	errorRows: z.number().int().min(0).default(0),
	validationProgress: z.number().min(0).max(100).default(0),
	savingProgress: z.number().min(0).max(100).default(0),
});

export type TaskProgressMetrics = z.infer<typeof TaskProgressMetricsSchema>;

/**
 * Complete Redis Progress State - Combines status and metrics
 */
export const TaskProgressStateSchema = z.object({
	detailedStatus: RedisProgressStatusSchema,
	metrics: TaskProgressMetricsSchema,
	lastHeartbeat: z.number().int().positive(),
	startedAt: z.number().int().positive().optional(),
	estimatedCompletionAt: z.number().int().positive().optional(),
});

export type TaskProgressState = z.infer<typeof TaskProgressStateSchema>;

/**
 * Combined Task Status - For API responses and UI display
 * Merges persistent DB status with real-time Redis progress
 */
export const CombinedTaskStatusSchema = z.object({
	id: z.number().int().positive(),
	persistentStatus: DbTaskStatusSchema,
	detailedStatus: RedisProgressStatusSchema.optional(),
	metrics: TaskProgressMetricsSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
	isActive: z.boolean() /* true if task is currently being processed */,
});

export type CombinedTaskStatus = z.infer<typeof CombinedTaskStatusSchema>;

/**
 * Status transition mappings
 */
export const TERMINAL_STATUSES: readonly DbTaskStatus[] = [
	"COMPLETED",
	"HAS_ERRORS",
	"FAILED",
] as const;

export const ACTIVE_STATUSES: readonly DbTaskStatus[] = [
	"PENDING",
	"PROCESSING",
] as const;

/**
 * Helper functions for status checking
 */
export const isTerminalStatus = (status: DbTaskStatus): boolean => {
	return (TERMINAL_STATUSES as readonly string[]).includes(status);
};

export const isActiveStatus = (status: DbTaskStatus): boolean => {
	return (ACTIVE_STATUSES as readonly string[]).includes(status);
};

/**
 * Status transition validation
 */
export const validateStatusTransition = (
	from: DbTaskStatus,
	to: DbTaskStatus
): boolean => {
	const validTransitions: Record<DbTaskStatus, DbTaskStatus[]> = {
		PENDING: ["PROCESSING", "FAILED"],
		PROCESSING: ["COMPLETED", "HAS_ERRORS", "FAILED"],
		COMPLETED: [] /* Terminal state */,
		HAS_ERRORS: [] /* Terminal state */,
		FAILED: [] /* Terminal state */,
	};

	return validTransitions[from]?.includes(to) ?? false;
};

/**
 * Redis key patterns for task progress storage
 */
export const REDIS_KEYS = {
	taskProgress: (taskId: number) => `task:${taskId}:progress`,
	taskCounters: (taskId: number) => `task:${taskId}:counters`,
	taskChunks: (taskId: number) => `task:${taskId}:chunks`,
	taskValidData: (taskId: number) => `task:${taskId}:valid_data`,
	taskLock: (taskId: number) => `task:${taskId}:lock`,
} as const;
