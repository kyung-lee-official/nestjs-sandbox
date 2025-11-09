import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class UploadLargeXlsxQueueService {
	private readonly logger = new Logger(UploadLargeXlsxQueueService.name);

	constructor(
		@InjectQueue("upload-xlsx-validation")
		private validationQueue: Queue,
		@InjectQueue("upload-xlsx-saving")
		private savingQueue: Queue
	) {}

	/**
	 * Add a validation job to the queue
	 * @param taskId - The task ID
	 * @param jobData - The job data
	 * @returns Promise resolving to the created job
	 */
	async addValidationJob(taskId: number, jobData: any) {
		const job = await this.validationQueue.add("validate-chunk", jobData, {
			/* Job options for better reliability */
			attempts: 3,
			backoff: {
				type: "exponential",
				delay: 2000,
			},
			removeOnComplete: 10 /* Keep last 10 completed jobs */,
			removeOnFail: 50 /* Keep last 50 failed jobs for debugging */,
		});

		this.logger.debug(`Added validation job for task ${taskId}: ${job.id}`);
		return job;
	}

	/**
	 * Add a saving job to the queue
	 * @param taskId - The task ID
	 * @param jobData - The job data
	 * @returns Promise resolving to the created job
	 */
	async addSavingJob(taskId: number, jobData: any) {
		const job = await this.savingQueue.add("save-chunk", jobData, {
			/* Job options for better reliability */
			attempts: 3,
			backoff: {
				type: "exponential",
				delay: 2000,
			},
			removeOnComplete: 10 /* Keep last 10 completed jobs */,
			removeOnFail: 50 /* Keep last 50 failed jobs for debugging */,
		});

		// this.logger.debug(`Added saving job for task ${taskId}: ${job.id}`);
		return job;
	}

	/**
	 * Get job counts for both queues
	 * @returns Object with job counts for each queue
	 */
	async getJobCounts() {
		const [validationCounts, savingCounts] = await Promise.all([
			this.validationQueue.getJobCounts(),
			this.savingQueue.getJobCounts(),
		]);

		return {
			validation: validationCounts,
			saving: savingCounts,
		};
	}

	/**
	 * Clear all jobs from both queues (useful for cleanup/testing)
	 * @returns Promise that resolves when all jobs are cleared
	 */
	async clearAllJobs() {
		await Promise.all([
			this.validationQueue.obliterate({ force: true }),
			this.savingQueue.obliterate({ force: true }),
		]);

		this.logger.log("Cleared all jobs from validation and saving queues");
	}

	/**
	 * Get queue health status
	 * @returns Object with health information for both queues
	 */
	async getQueueHealth() {
		const jobCounts = await this.getJobCounts();

		return {
			validation: {
				isHealthy:
					jobCounts.validation.failed === 0 ||
					jobCounts.validation.failed < 10,
				counts: jobCounts.validation,
			},
			saving: {
				isHealthy:
					jobCounts.saving.failed === 0 ||
					jobCounts.saving.failed < 10,
				counts: jobCounts.saving,
			},
		};
	}
}
