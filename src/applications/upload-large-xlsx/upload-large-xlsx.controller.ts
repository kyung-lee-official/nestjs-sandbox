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
import { ApiConsumes, ApiOperation, ApiParam, ApiBody } from "@nestjs/swagger";
import { UploadLargeXlsxService } from "./upload-large-xlsx.service";
import {
	uploadXlsxApiOperation,
	uploadXlsxApiBody,
	getBatchesApiOperation,
	deleteDataByBatchIdApiOperation,
	deleteDataByBatchIdApiParam,
} from "./swagger/upload-large-xlsx.swagger";
import { Response } from "express";

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

	@ApiOperation(getBatchesApiOperation)
	@Get("batches")
	async getBatches() {
		return this.uploadLargeXlsxService.getBatches();
	}

	@ApiOperation(deleteDataByBatchIdApiOperation)
	@ApiParam(deleteDataByBatchIdApiParam)
	@Delete("delete-data-by-batch-id/:batchId")
	async deleteDataByBatchId(@Param("batchId", ParseIntPipe) batchId: number) {
		try {
			return await this.uploadLargeXlsxService.deleteDataByBatchId(
				batchId
			);
		} catch (error) {
			throw new BadRequestException(
				`Failed to delete batch: ${(error as Error).message}`
			);
		}
	}
}
