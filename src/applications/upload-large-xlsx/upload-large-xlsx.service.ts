import { BadRequestException, Injectable } from "@nestjs/common";
import { Response } from "express";
import { PrismaService } from "../../recipes/prisma/prisma.service";
import * as ExcelJS from "exceljs";
import {
	CreateUploadLargeXlsxDto,
	CreateUploadLargeXlsxSchema,
} from "./dto/create-upload-large-xlsx.dto";
import { validateXlsxHeaders, sendValidationErrorXlsx } from "src/utils/xlsx";

@Injectable()
export class UploadLargeXlsxService {
	constructor(private prismaService: PrismaService) {}

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

		const data: CreateUploadLargeXlsxDto[] = [];
		const columnMap = await validateXlsxHeaders(file.buffer, [
			"Name",
			"Gender",
			"Bio-ID",
		]);
		let validationErrors: { row: number; errors: string[] }[] = [];

		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(file.buffer as any);
		const worksheet = workbook.getWorksheet(1);
		worksheet!.eachRow((row, rowNumber) => {
			/* Validate each row */
			if (rowNumber > 1) {
				const rowData = {
					name: row.getCell(columnMap["Name"]).text,
					gender: row.getCell(columnMap["Gender"]).text,
					bioId: row.getCell(columnMap["Bio-ID"]).text,
				};

				try {
					CreateUploadLargeXlsxSchema.parse(rowData);
					data.push(rowData);
				} catch (error: any) {
					const errors = error.issues?.map(
						(issue: any) =>
							`${issue.path.join(".")}: ${issue.message}`
					) || [error.message];
					validationErrors.push({
						row: rowNumber,
						errors: errors,
					});
				}
			}
		});

		/* If there are validation errors, create error XLSX file and return */
		if (validationErrors.length > 0) {
			await sendValidationErrorXlsx(validationErrors, response);
		}

		/* Create a new task */
		const task = await this.prismaService.uploadLargeXlsxTask.create({
			data: {},
		});

		/* Save valid data to database */
		if (data.length > 0) {
			await this.prismaService.uploadLargeXlsxData.createMany({
				data: data.map((item) => ({
					...item,
					taskId: task.id,
				})),
			});
		}

		response.status(200).json({
			success: true,
			taskId: task.id,
			processedRecords: data.length,
			message: `Successfully processed ${data.length} records`,
		});
	}

	async getTaskes() {
		return this.prismaService.uploadLargeXlsxTask.findMany({
			include: {
				data: true,
				_count: {
					select: { data: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});
	}

	async deleteDataByTaskId(taskId: number) {
		/* Delete all data entries for this task */
		const deletedData =
			await this.prismaService.uploadLargeXlsxData.deleteMany({
				where: { taskId },
			});
		/* Delete the task itself */
		await this.prismaService.uploadLargeXlsxTask.delete({
			where: { id: taskId },
		});

		return {
			success: true,
			deletedRecords: deletedData.count,
			message: `Task ${taskId} and ${deletedData.count} records deleted successfully`,
		};
	}
}
