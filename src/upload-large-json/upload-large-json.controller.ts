import {
	Controller,
	Get,
	Post,
	Param,
	Delete,
	ParseIntPipe,
	UseInterceptors,
	UploadedFile,
} from "@nestjs/common";
import { UploadLargeJsonService } from "./upload-large-json.service";
import { ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Upload Large Json")
@Controller("upload-large-json")
export class UploadLargeJsonController {
	constructor(
		private readonly uploadLargeJsonService: UploadLargeJsonService
	) {}

	@Post()
	@UseInterceptors(
		FileInterceptor("data")
	) /* intercept the data from FormData */
	async create(@UploadedFile() data: Express.Multer.File) {
		return this.uploadLargeJsonService.create(data);
	}

	@Get()
	findAll() {
		return this.uploadLargeJsonService.findAll();
	}

	@Delete(":batchId")
	async remove(@Param("batchId", ParseIntPipe) batchId: number) {
		return await this.uploadLargeJsonService.remove(batchId);
	}
}
