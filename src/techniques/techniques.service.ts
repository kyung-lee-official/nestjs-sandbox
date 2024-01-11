import { Injectable } from "@nestjs/common";
import { CreateTechniqueDto } from "./dto/create-technique.dto";
import { UpdateTechniqueDto } from "./dto/update-technique.dto";
import { writeFile } from "fs/promises";

@Injectable()
export class TechniquesService {
	async upload(file: Express.Multer.File) {
		console.log(file);
		/* Save file to local */
		await writeFile(`./file-uploads/${file.originalname}`, file.buffer);
		return { success: true };
	}

	async download(res: any) {
		const file = `./file-downloads/download-example.png`;
		res.download(file);
	}

	create(createTechniqueDto: CreateTechniqueDto) {
		return "This action adds a new technique";
	}

	findAll() {
		return `This action returns all techniques`;
	}

	findOne(id: number) {
		return `This action returns a #${id} technique`;
	}

	update(id: number, updateTechniqueDto: UpdateTechniqueDto) {
		return `This action updates a #${id} technique`;
	}

	remove(id: number) {
		return `This action removes a #${id} technique`;
	}
}
