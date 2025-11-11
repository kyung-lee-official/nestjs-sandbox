import { BadRequestException, Injectable } from "@nestjs/common";
import { Response } from "express";
import { PrismaService } from "../../recipes/prisma/prisma.service";
import { BullQueueService } from "./services/bull-queue.service";
import { RedisStorageService } from "./services/redis-storage.service";
import {
	ProcessFileJobData,
	DbTaskStatusSchema,
	ProcessFileJobDataSchema,
	ActiveStatusesSchema,
	TerminalStatusesSchema,
} from "./types";

@Injectable()
export class UploadLargeXlsxService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly bullQueueService: BullQueueService,
		private readonly redisStorageService: RedisStorageService
	) {}

	async uploadXlsx(file: Express.Multer.File, response: Response) {
		if (!file) {
			throw new BadRequestException("No file uploaded");
		}
		if (
			!file.mimetype.includes("spreadsheet") &&
			!file.originalname.endsWith(".xlsx")
		) {
			throw new BadRequestException("File must be an XLSX file");
		}

		/* Create a new task with pending status */
		const task = await this.prismaService.uploadLargeXlsxTask.create({
			data: {
				status: ActiveStatusesSchema.enum.PENDING,
				totalRows: 0 /* Will be updated after processing */,
			},
		});

		/* Store file temporarily in Redis */
		const fileKey = await this.redisStorageService.storeFile(
			task.id,
			file.buffer
		);

		/* Create job data and validate it */
		const jobData: ProcessFileJobData = {
			taskId: task.id,
			fileKey,
			fileName: file.originalname,
		};

		/* Validate job data with Zod */
		const validatedJobData = ProcessFileJobDataSchema.parse(jobData);

		/* Return immediately with task info */
		response.status(200).json({
			success: true,
			taskId: task.id,
			message: "Upload finished, starting validation",
		});

		/* Queue file processing job asynchronously (don't await) */
		setImmediate(async () => {
			try {
				await this.bullQueueService.addFileProcessingJob(
					validatedJobData
				);
			} catch (error) {
				/* If job queuing fails, update task status and clean up */
				await this.prismaService.uploadLargeXlsxTask.update({
					where: { id: task.id },
					data: { status: TerminalStatusesSchema.enum.FAILED as any },
				});
				await this.redisStorageService.deleteFile(fileKey);
			}
		});
	}

	async getTasks(page: number = 1) {
		const pageSize = 10;
		const skip = (page - 1) * pageSize;

		const tasks = await this.prismaService.uploadLargeXlsxTask.findMany({
			skip,
			take: pageSize,
			orderBy: { createdAt: "desc" },
		});
		return tasks;
	}

	async getTaskById(taskId: number) {
		return this.prismaService.uploadLargeXlsxTask.findUnique({
			where: { id: taskId },
			include: {
				data: true,
				errors: true,
				_count: {
					select: {
						data: true,
						errors: true,
					},
				},
			},
		});
	}

	async deleteDataByTaskId(taskId: number) {
		/* Delete all data entries for this task */
		const deletedData =
			await this.prismaService.uploadLargeXlsxData.deleteMany({
				where: { taskId },
			});

		/* Delete all error entries for this task */
		const deletedErrors =
			await this.prismaService.uploadLargeXlsxError.deleteMany({
				where: { taskId },
			});

		/* Delete the task itself */
		await this.prismaService.uploadLargeXlsxTask.delete({
			where: { id: taskId },
		});

		return {
			success: true,
			deletedRecords: deletedData.count,
			deletedErrors: deletedErrors.count,
			message: `Task ${taskId} deleted successfully with ${deletedData.count} records and ${deletedErrors.count} errors`,
		};
	}
}
