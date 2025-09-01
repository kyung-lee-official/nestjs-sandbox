import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTechniqueDto } from "./dto/create-technique.dto";
import { UpdateTechniqueDto } from "./dto/update-technique.dto";
import { readdir, unlink, writeFile } from "fs/promises";
import * as pako from "pako";
import * as ExcelJS from "exceljs";

type ArchiveFile = {
	purpose: string;
	name: string;
	data: number[];
};

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

	async uploadCompressedFiles(file: Express.Multer.File) {
		try {
			/* decompress the gzipped data */
			const decompressed = pako.ungzip(file.buffer, { to: "string" });
			/* parse the JSON archive */
			const archiveFiles: ArchiveFile[] = JSON.parse(decompressed);

			for (const file of archiveFiles) {
				const fileBuffer = Buffer.from(file.data);
				const workbook = new ExcelJS.Workbook();
				await workbook.xlsx.load(fileBuffer as any);
				const sheetNames = workbook.worksheets.map(
					(sheet) => sheet.name
				);
				console.log(file.name, sheetNames);
			}

			return {
				status: "ok",
			};
		} catch (error) {
			if (error instanceof SyntaxError) {
				throw new BadRequestException(
					"Invalid JSON in compressed archive"
				);
			}
			throw new BadRequestException(
				`Decompression failed: ${(error as Error).message}`
			);
		}
	}

	async uploadModifiedExcel(file: Express.Multer.File) {
		/* Process the uploaded Excel file */
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(file.buffer as any);
		/* check A1 */
		const worksheet = workbook.getWorksheet(1);
		const cellValue = worksheet!.getCell("A1").value;
		console.log("A1:", cellValue);

		return { status: "ok" };
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
