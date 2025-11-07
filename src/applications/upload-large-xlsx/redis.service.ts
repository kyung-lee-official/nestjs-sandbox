import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../../redis/redis.service";
import { UploadLargeXlsxRowData } from "./upload-large-xlsx.queue/interfaces";

@Injectable()
export class UploadLargeXlsxRedisService {
	private readonly logger = new Logger(UploadLargeXlsxRedisService.name);

	constructor(private readonly redisService: RedisService) {}

	/**
	 * Store valid data for a task in Redis as a list
	 * @param taskId - The task ID
	 * @param validData - Array of valid row data to store
	 */
	async saveValidDataChunk(
		taskId: number,
		validData: UploadLargeXlsxRowData[]
	): Promise<void> {
		const redis = this.redisService.getClient();
		const key = this.getValidDataKey(taskId);
		const pipeline = redis.pipeline();

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
		const redis = this.redisService.getClient();
		const key = this.getValidDataKey(taskId);
		const rawData = await redis.lrange(key, 0, -1);

		const validData = rawData.map((item) =>
			JSON.parse(item)
		) as UploadLargeXlsxRowData[];
		// this.logger.debug(
		// 	`Retrieved ${validData.length} valid records for task ${taskId}`
		// );

		return validData;
	}

	/**
	 * Clean up temporary data for a task
	 * @param taskId - The task ID
	 */
	async cleanupTaskData(taskId: number): Promise<void> {
		const redis = this.redisService.getClient();
		const keys = [
			this.getValidDataKey(taskId),
			this.getChunkStatusKey(taskId),
			this.getTaskMetadataKey(taskId),
		];

		await redis.del(...keys);
		// this.logger.debug(`Cleaned up temporary data for task ${taskId}`);
	}

	/**
	 * Track completed validation chunks
	 * @param taskId - The task ID
	 * @param chunkIndex - The completed chunk index
	 * @param totalChunks - Total number of chunks
	 * @returns True if all chunks are completed
	 */
	async markChunkCompleted(
		taskId: number,
		chunkIndex: number,
		totalChunks: number
	): Promise<boolean> {
		const redis = this.redisService.getClient();
		const key = this.getChunkStatusKey(taskId);

		/* Add chunk to completed set */
		await redis.sadd(key, chunkIndex.toString());
		/* await redis.expire(key, 24 * 60 * 60); 24 hours TTL */

		/* Check if all chunks are completed */
		const completedCount = await redis.scard(key);
		const isAllCompleted = completedCount >= totalChunks;

		// this.logger.debug(
		// 	`Task ${taskId}: Chunk ${chunkIndex + 1}/${totalChunks} completed. ` +
		// 		`Total completed: ${completedCount}/${totalChunks}`
		// );

		return isAllCompleted;
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
		const redis = this.redisService.getClient();
		const key = this.getTaskMetadataKey(taskId);
		await redis.hset(key, metadata);
		/* await redis.expire(key, 24 * 60 * 60); 24 hours TTL */
	}

	/**
	 * Get task metadata
	 * @param taskId - The task ID
	 * @returns Task metadata object
	 */
	async getTaskMetadata(taskId: number): Promise<Record<string, string>> {
		const redis = this.redisService.getClient();
		const key = this.getTaskMetadataKey(taskId);
		return await redis.hgetall(key);
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
}
