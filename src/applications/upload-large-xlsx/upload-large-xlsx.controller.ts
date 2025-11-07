import {
	Controller,
	Get,
	Post,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	ParseIntPipe,
	BadRequestException,
	Res,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
	ApiConsumes,
	ApiOperation,
	ApiParam,
	ApiBody,
	ApiTags,
} from "@nestjs/swagger";
import { UploadLargeXlsxService } from "./upload-large-xlsx.service";
import {
	uploadXlsxApiOperation,
	uploadXlsxApiBody,
	getTasksApiOperation,
	getTaskByIdApiOperation,
	getTaskByIdApiParam,
	deleteDataByTaskIdApiOperation,
	deleteDataByTaskIdApiParam,
} from "./swagger/upload-large-xlsx.swagger";
import { Response } from "express";

@ApiTags("Upload Large Xlsx")
@Controller("applications/upload-large-xlsx")
export class UploadLargeXlsxController {
	constructor(
		private readonly uploadLargeXlsxService: UploadLargeXlsxService
	) {}

	@ApiOperation(uploadXlsxApiOperation)
	@ApiConsumes("multipart/form-data")
	@ApiBody(uploadXlsxApiBody)
	@Post("upload")
	@UseInterceptors(FileInterceptor("file"))
	async uploadXlsx(
		@UploadedFile() file: Express.Multer.File,
		@Res() response: Response
	) {
		await this.uploadLargeXlsxService.uploadXlsx(file, response);
	}

	@ApiOperation(getTasksApiOperation)
	@Get("tasks")
	async getTasks() {
		return this.uploadLargeXlsxService.getTasks();
	}

	@ApiOperation(getTaskByIdApiOperation)
	@ApiParam(getTaskByIdApiParam)
	@Get("tasks/:taskId")
	async getTaskById(@Param("taskId", ParseIntPipe) taskId: number) {
		const task = await this.uploadLargeXlsxService.getTaskById(taskId);
		if (!task) {
			throw new BadRequestException(`Task with ID ${taskId} not found`);
		}
		return task;
	}

	@ApiOperation(deleteDataByTaskIdApiOperation)
	@ApiParam(deleteDataByTaskIdApiParam)
	@Delete("delete-data-by-task-id/:taskId")
	async deleteDataByTaskId(@Param("taskId", ParseIntPipe) taskId: number) {
		try {
			return await this.uploadLargeXlsxService.deleteDataByTaskId(taskId);
		} catch (error) {
			throw new BadRequestException(
				`Failed to delete task: ${(error as Error).message}`
			);
		}
	}
}
