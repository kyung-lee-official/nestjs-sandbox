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
			return await sendValidationErrorXlsx(validationErrors, response);
		}

		/* Create a new batch */
		const batch = await this.prismaService.uploadLargeXlsxBatch.create({
			data: {},
		});

		/* Save valid data to database */
		if (data.length > 0) {
			await this.prismaService.uploadLargeXlsxData.createMany({
				data: data.map((item) => ({
					...item,
					batchId: batch.id,
				})),
			});
		}

		response.status(200).json({
			success: true,
			batchId: batch.id,
			processedRecords: data.length,
			message: `Successfully processed ${data.length} records`,
		});
	}

	async getBatches() {
		return this.prismaService.uploadLargeXlsxBatch.findMany({
			include: {
				data: true,
				_count: {
					select: { data: true },
				},
			},
			orderBy: { createdAt: "desc" },
		});
	}

	async deleteDataByBatchId(batchId: number) {
		/* Delete all data entries for this batch */
		const deletedData =
			await this.prismaService.uploadLargeXlsxData.deleteMany({
				where: { batchId },
			});
		/* Delete the batch itself */
		await this.prismaService.uploadLargeXlsxBatch.delete({
			where: { id: batchId },
		});

		return {
			success: true,
			deletedRecords: deletedData.count,
			message: `Batch ${batchId} and ${deletedData.count} records deleted successfully`,
		};
	}
}
