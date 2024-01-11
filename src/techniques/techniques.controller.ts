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
} from "@nestjs/common";
import { TechniquesService } from "./techniques.service";
import { CreateTechniqueDto } from "./dto/create-technique.dto";
import { UpdateTechniqueDto } from "./dto/update-technique.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation } from "@nestjs/swagger";

@Controller("techniques")
export class TechniquesController {
	constructor(private readonly techniquesService: TechniquesService) {}

	@ApiOperation({
		summary: "Upload a file",
		description: `# Upload a file to the server
File saved to ./file-uploads/`,
	})
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
			},
		},
	})
	@Put("file-upload")
	@UseInterceptors(FileInterceptor("file"))
	async upload(@UploadedFile() file: Express.Multer.File): Promise<any> {
		return this.techniquesService.upload(file);
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

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.techniquesService.remove(+id);
	}
}
