import { Injectable, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { RedisService } from "../../redis/redis.service";
import { UploadLargeXlsxRowData } from "./types";

@Injectable()
export class UploadLargeXlsxRedisService {
	private readonly logger = new Logger(UploadLargeXlsxRedisService.name);
	private readonly redis: Redis;

	constructor(private readonly redisService: RedisService) {
		this.redis = this.redisService.getClient();
	}

	/**
	 * Store valid data for a task in Redis as a list
	 * @param taskId - The task ID
	 * @param validData - Array of valid row data to store
	 */
	async saveValidDataChunk(
		taskId: number,
		validData: UploadLargeXlsxRowData[]
	): Promise<void> {
		const key = this.getValidDataKey(taskId);
		const pipeline = this.redis.pipeline();
		/* Add each valid record to the list */
		validData.forEach((data) => {
			pipeline.lpush(key, JSON.stringify(data));
		});
		/* Set expiration (24 hours) */
		pipeline.expire(key, 24 * 60 * 60);
		await pipeline.exec();
		// this.logger.debug(
		// 	`Saved ${validData.length} valid records for task ${taskId}`
		// );
	}

	/**
	 * Get all valid data for a task from Redis
	 * @param taskId - The task ID
	 * @returns Array of all valid data records
	 */
	async getAllValidData(taskId: number): Promise<UploadLargeXlsxRowData[]> {
		const key = this.getValidDataKey(taskId);
		const rawData = await this.redis.lrange(key, 0, -1);

		const validData = rawData.map((item) =>
			JSON.parse(item)
		) as UploadLargeXlsxRowData[];
		// this.logger.debug(
		// 	`Retrieved ${validData.length} valid records for task ${taskId}`
		// );

		return validData;
	}

	/**
	 * Track completed validation chunks
	 * @param taskId - The task ID
	 * @param chunkIndex - The completed chunk index
	 * @param totalChunks - Total number of chunks
	 * @returns True if all chunks are completed AND this is the first to detect completion
	 */
	async markChunkCompleted(
		taskId: number,
		chunkIndex: number,
		totalChunks: number
	): Promise<boolean> {
		const key = this.getChunkStatusKey(taskId);
		const lockKey = this.getCompletionLockKey(taskId);

		/* Add chunk to completed set */
		await this.redis.sadd(key, chunkIndex.toString());
		await this.redis.expire(key, 24 * 60 * 60); // 24 hours TTL - same as counters

		/* Check if all chunks are completed */
		const completedCount = await this.redis.scard(key);
		const isAllCompleted = completedCount >= totalChunks;

		if (isAllCompleted) {
			/* Try to acquire completion lock to ensure only one chunk handles completion */
			const lockAcquired = await this.redis.set(
				lockKey,
				"1",
				"EX",
				300,
				"NX"
			); // 5 minute lock

			this.logger.debug(
				`Task ${taskId}: Chunk ${chunkIndex + 1}/${totalChunks} completed. ` +
					`Total completed: ${completedCount}/${totalChunks}. Lock acquired: ${!!lockAcquired}`
			);

			return !!lockAcquired; // Only return true if we acquired the lock
		}

		this.logger.debug(
			`Task ${taskId}: Chunk ${chunkIndex + 1}/${totalChunks} completed. ` +
				`Total completed: ${completedCount}/${totalChunks}`
		);

		return false;
	}

	/**
	 * Store task metadata (optional - for future use)
	 * @param taskId - The task ID
	 * @param metadata - Task metadata to store
	 */
	async setTaskMetadata(
		taskId: number,
		metadata: Record<string, any>
	): Promise<void> {
		const key = this.getTaskMetadataKey(taskId);
		await this.redis.hset(key, metadata);
		/* await redis.expire(key, 24 * 60 * 60); 24 hours TTL */
	}

	/**
	 * Get task metadata
	 * @param taskId - The task ID
	 * @returns Task metadata object
	 */
	async getTaskMetadata(taskId: number): Promise<Record<string, string>> {
		const key = this.getTaskMetadataKey(taskId);
		return await this.redis.hgetall(key);
	}

	/**
	 * Initialize counters for a new task
	 * @param taskId - The task ID
	 */
	async initializeTaskCounters(taskId: number): Promise<void> {
		const pipeline = this.redis.pipeline();

		pipeline.set(this.getValidatedRowsKey(taskId), 0);
		pipeline.set(this.getSavedRowsKey(taskId), 0);
		pipeline.set(this.getErrorRowsKey(taskId), 0);

		// Set expiration for all counters
		pipeline.expire(this.getValidatedRowsKey(taskId), 24 * 60 * 60);
		pipeline.expire(this.getSavedRowsKey(taskId), 24 * 60 * 60);
		pipeline.expire(this.getErrorRowsKey(taskId), 24 * 60 * 60);

		const results = await pipeline.exec();

		this.logger.debug(
			`Initialized Redis counters for task ${taskId}:`,
			{
				validatedRowsKey: this.getValidatedRowsKey(taskId),
				savedRowsKey: this.getSavedRowsKey(taskId),
				errorRowsKey: this.getErrorRowsKey(taskId),
			},
			`Pipeline results:`,
			results
		);
	}

	/**
	 * Atomically increment validated rows counter
	 * @param taskId - The task ID
	 * @param count - Number to increment by
	 * @returns Updated count
	 */
	async incrementValidatedRows(
		taskId: number,
		count: number
	): Promise<number> {
		const key = this.getValidatedRowsKey(taskId);
		const newCount = await this.redis.incrby(key, count);
		await this.redis.expire(key, 24 * 60 * 60); // 24 hours TTL
		return newCount;
	}

	/**
	 * Atomically increment saved rows counter
	 * @param taskId - The task ID
	 * @param count - Number to increment by
	 * @returns Updated count
	 */
	async incrementSavedRows(taskId: number, count: number): Promise<number> {
		const key = this.getSavedRowsKey(taskId);
		const newCount = await this.redis.incrby(key, count);
		await this.redis.expire(key, 24 * 60 * 60); // 24 hours TTL
		return newCount;
	}

	/**
	 * Atomically increment error rows counter
	 * @param taskId - The task ID
	 * @param count - Number to increment by
	 * @returns Updated count
	 */
	async incrementErrorRows(taskId: number, count: number): Promise<number> {
		const key = this.getErrorRowsKey(taskId);
		const newCount = await this.redis.incrby(key, count);
		await this.redis.expire(key, 24 * 60 * 60); // 24 hours TTL
		return newCount;
	}

	/**
	 * Get current counters for a task
	 * @param taskId - The task ID
	 * @returns Object with all counters
	 */
	async getTaskCounters(taskId: number): Promise<{
		validatedRows: number;
		savedRows: number;
		errorRows: number;
	}> {
		const pipeline = this.redis.pipeline();

		pipeline.get(this.getValidatedRowsKey(taskId));
		pipeline.get(this.getSavedRowsKey(taskId));
		pipeline.get(this.getErrorRowsKey(taskId));

		const results = await pipeline.exec();

		const counters = {
			validatedRows: parseInt((results?.[0]?.[1] as string) || "0"),
			savedRows: parseInt((results?.[1]?.[1] as string) || "0"),
			errorRows: parseInt((results?.[2]?.[1] as string) || "0"),
		};

		this.logger.debug(
			`Retrieved Redis counters for task ${taskId}:`,
			counters,
			`Raw results:`,
			results?.map((r) => r?.[1])
		);

		return counters;
	}

	/**
	 * Clean up temporary data for a task
	 * @param taskId - The task ID
	 */
	async cleanupTaskData(taskId: number): Promise<void> {
		const keys = [
			this.getValidDataKey(taskId),
			this.getChunkStatusKey(taskId),
			this.getTaskMetadataKey(taskId),
			this.getValidatedRowsKey(taskId),
			this.getSavedRowsKey(taskId),
			this.getErrorRowsKey(taskId),
			this.getCompletionLockKey(taskId),
		];

		await this.redis.del(...keys);
		// this.logger.debug(`Cleaned up temporary data for task ${taskId}`);
	}

	/* Private helper methods for generating Redis keys */
	private getValidDataKey(taskId: number): string {
		return `upload-xlsx:${taskId}:valid-data`;
	}

	private getChunkStatusKey(taskId: number): string {
		return `upload-xlsx:${taskId}:chunks`;
	}

	private getTaskMetadataKey(taskId: number): string {
		return `upload-xlsx:${taskId}:metadata`;
	}

	private getValidatedRowsKey(taskId: number): string {
		return `upload-xlsx:${taskId}:validated-rows`;
	}

	private getSavedRowsKey(taskId: number): string {
		return `upload-xlsx:${taskId}:saved-rows`;
	}

	private getErrorRowsKey(taskId: number): string {
		return `upload-xlsx:${taskId}:error-rows`;
	}

	private getCompletionLockKey(taskId: number): string {
		return `upload-xlsx:${taskId}:completion-lock`;
	}
}
