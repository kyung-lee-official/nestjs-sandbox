import {
	Controller,
	Get,
	Post,
	Put,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	Res,
	UploadedFiles,
	BadRequestException,
} from "@nestjs/common";
import { TechniquesService } from "./techniques.service";
import { CreateTechniqueDto } from "./dto/create-technique.dto";
import { UpdateTechniqueDto } from "./dto/update-technique.dto";
import {
	AnyFilesInterceptor,
	FileInterceptor,
	FilesInterceptor,
} from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import {
	uploadFileApiBodyOptions,
	uploadFileApiOperationOptions,
} from "./swagger/upload-file.swagger";
import { uploadFilesApiOperationOptions } from "./swagger/upload-files.swagger";

@Controller("techniques")
export class TechniquesController {
	constructor(private readonly techniquesService: TechniquesService) {}

	@ApiOperation(uploadFileApiOperationOptions)
	@ApiConsumes("multipart/form-data")
	@ApiBody(uploadFileApiBodyOptions)
	@Put("file-upload")
	@UseInterceptors(FileInterceptor("file"))
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
		return this.techniquesService.uploadFile(file);
	}

	@ApiOperation(uploadFilesApiOperationOptions)
	@ApiConsumes("multipart/form-data")
	// @ApiBody(uploadFilesApiBodyOptions)
	@Put("files-upload-array")
	@UseInterceptors(FilesInterceptor("files"))
	async uploadFilesArrary(@UploadedFiles() files: Express.Multer.File[]) {
		return await this.techniquesService.uploadFilesArrary(files);
	}

	@ApiOperation(uploadFilesApiOperationOptions)
	@ApiConsumes("multipart/form-data")
	// @ApiBody(uploadFilesApiBodyOptions)
	@Put("files-upload-any")
	@UseInterceptors(AnyFilesInterceptor())
	async uploadFilesAny(@UploadedFiles() files: Express.Multer.File[]) {
		return await this.techniquesService.uploadFilesAny(files);
	}

	@ApiOperation({
		summary: "Download a file",
		description: `# Download a file from the server
File downloaded from ./file-downloads/`,
	})
	@Get("file-download")
	async download(@Res() res: any): Promise<any> {
		return this.techniquesService.download(res);
	}

	@Get("preview-filelist")
	async previewFileList(): Promise<any> {
		return await this.techniquesService.previewFileList();
	}

	@Get("preview-image/:filename")
	async previewImage(
		@Param("filename") filename: string,
		@Res() res: any
	): Promise<any> {
		return await this.techniquesService.previewImage(filename, res);
	}

	@Delete("delete-file/:filename")
	async deleteFile(@Param("filename") filename: string) {
		return await this.techniquesService.deleteFile(filename);
	}

	@Post("upload-compressed-single-blob")
	@UseInterceptors(FileInterceptor("compressed_archive"))
	async uploadCompressedFiles(@UploadedFile() file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException("No file uploaded");
		}
		if (file.mimetype !== "application/gzip") {
			throw new BadRequestException("File must be gzipped");
		}
		try {
			const result =
				await this.techniquesService.uploadCompressedFiles(file);
			return {
				success: true,
				message: "Files processed successfully",
				data: result,
			};
		} catch (error) {
			throw new BadRequestException(
				`Failed to process archive: ${(error as Error).message}`
			);
		}
	}

	@Post("upload-modified-excel")
	@UseInterceptors(FileInterceptor("file"))
	async uploadModifiedExcel(@UploadedFile() file: Express.Multer.File) {
		return await this.techniquesService.uploadModifiedExcel(file);
	}

	@Post()
	create(@Body() createTechniqueDto: CreateTechniqueDto) {
		return this.techniquesService.create(createTechniqueDto);
	}

	@Get()
	findAll() {
		return this.techniquesService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.techniquesService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateTechniqueDto: UpdateTechniqueDto
	) {
		return this.techniquesService.update(+id, updateTechniqueDto);
	}
}
