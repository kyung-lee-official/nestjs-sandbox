import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	Put,
} from "@nestjs/common";
import { TencentCosObjectsService } from "./tencent-cos-objects.service";
import { UpdateTencentCosObjectDto } from "./dto/update-tencent-cos-object.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import * as COS from "cos-nodejs-sdk-v5";
import { CredentialData } from "qcloud-cos-sts";

@Controller("tencent-cos-objects")
export class TencentCosObjectsController {
	constructor(
		private readonly tencentCosObjectsService: TencentCosObjectsService
	) {}

	@Get("temporary-credential")
	async getTemporaryCredential(): Promise<CredentialData> {
		return this.tencentCosObjectsService.getTemporaryCredential();
	}

	@Put("uploadFileToCos")
	@UseInterceptors(FileInterceptor("file"))
	async uploadFileToCos(
		@UploadedFile() file: Express.Multer.File
	): Promise<COS.PutObjectResult> {
		return this.tencentCosObjectsService.uploadFileToCos(file);
	}

	@Get()
	findAll() {
		return this.tencentCosObjectsService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.tencentCosObjectsService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateTencentCosObjectDto: UpdateTencentCosObjectDto
	) {
		return this.tencentCosObjectsService.update(
			+id,
			updateTencentCosObjectDto
		);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.tencentCosObjectsService.remove(+id);
	}
}
