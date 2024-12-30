import { Injectable } from "@nestjs/common";
import { CreateTechniqueDto } from "./dto/create-technique.dto";
import { UpdateTechniqueDto } from "./dto/update-technique.dto";
import { readdir, unlink, writeFile } from "fs/promises";

@Injectable()
export class TechniquesService {
	async uploadFile(file: Express.Multer.File) {
		console.log(file);
		/* Save file to local */
		await writeFile(`./file-uploads/${file.originalname}`, file.buffer);
		return { success: true };
	}

	async uploadFilesArrary(files: Express.Multer.File[]) {
		console.log(files);
		/* Save file to local */
		for (const file of files) {
			await writeFile(`./file-uploads/${file.originalname}`, file.buffer);
		}
		return { success: true };
	}

	async uploadFilesAny(files: Express.Multer.File[]) {
		console.log(files);
		/* Save file to local */
		// for (const file of files) {
		// 	await writeFile(`./file-uploads/${file.originalname}`, file.buffer);
		// }
		return { success: true };
	}

	async download(res: any) {
		const file = `./file-downloads/download-example.png`;
		res.download(file);
	}

	async previewFileList() {
		const items = await readdir("./file-uploads");
		/* exclude .gitkeep */
		items.splice(items.indexOf(".gitkeep"), 1);
		const files: { name: string }[] = items.map((item) => {
			return {
				name: item,
			};
		});
		return files;
	}

	async previewImage(filename: string, res: any) {
		const image = `./file-uploads/${filename}`;
		res.download(image);
	}

	async deleteFile(filename: string) {
		await unlink(`./file-uploads/${filename}`);
		return { success: true };
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
}
