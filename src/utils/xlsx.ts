import { BadRequestException } from "@nestjs/common";
import { Response } from "express";
import * as ExcelJS from "exceljs";

/**
 * Validates XLSX file format by checking if all required headers are present
 * @param buffer - The XLSX file buffer
 * @param requiredHeaders - Array of required header names
 * @returns Object mapping header names to their column indices (0-based)
 * @throws BadRequestException if any required headers are missing
 */
export async function validateXlsxHeaders(
	buffer: Buffer,
	requiredHeaders: string[]
): Promise<Record<string, number>> {
	try {
		/* Load the workbook from buffer */
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(buffer as any);

		/* Get the first worksheet */
		const worksheet = workbook.getWorksheet(1);
		if (!worksheet) {
			throw new BadRequestException(
				"XLSX file must contain at least one worksheet"
			);
		}

		/* Reuse the worksheet validation logic */
		return validateWorksheetHeaders(worksheet, requiredHeaders);
	} catch (error) {
		if (error instanceof BadRequestException) {
			throw error;
		}
		throw new BadRequestException(
			`Failed to validate XLSX file: ${(error as Error).message}`
		);
	}
}

/**
 * Alternative function that accepts worksheet directly
 * @param worksheet - ExcelJS worksheet object
 * @param requiredHeaders - Array of required header names
 * @returns Object mapping header names to their column indices (0-based)
 */
export function validateWorksheetHeaders(
	worksheet: ExcelJS.Worksheet,
	requiredHeaders: string[]
): Record<string, number> {
	/* Get the first row (header row) */
	const headerRow = worksheet.getRow(1);
	if (!headerRow || headerRow.cellCount === 0) {
		throw new BadRequestException("Worksheet must contain a header row");
	}

	/* Extract header values and create a map */
	const headerMap: Record<string, number> = {};
	const foundHeaders: string[] = [];

	headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
		const cellValue = cell.value?.toString().trim();
		if (cellValue) {
			headerMap[cellValue] = colNumber - 1; /* Convert to 0-based index */
			foundHeaders.push(cellValue);
		}
	});

	/* Check required headers */
	const missingHeaders: string[] = [];
	const resultMap: Record<string, number> = {};

	for (const requiredHeader of requiredHeaders) {
		if (headerMap.hasOwnProperty(requiredHeader)) {
			resultMap[requiredHeader] = headerMap[requiredHeader];
		} else {
			missingHeaders.push(requiredHeader);
		}
	}

	if (missingHeaders.length > 0) {
		throw new BadRequestException(
			`Missing required headers: ${missingHeaders.join(", ")}. ` +
				`Found headers: ${foundHeaders.join(", ")}`
		);
	}

	return resultMap;
}

/**
 * Generates and sends a validation error XLSX file as HTTP response
 * @param validationErrors - Array of validation errors with row numbers and error messages
 * @param response - Express response object
 * @returns Promise that resolves when the response is sent
 */
export async function sendValidationErrorXlsx(
	validationErrors: { row: number; errors: string[] }[],
	response: Response
): Promise<void> {
	const errorWorkbook = new ExcelJS.Workbook();
	const errorWorksheet = errorWorkbook.addWorksheet("Validation Errors");

	/* Add headers */
	errorWorksheet.addRow(["Row Number", "Errors"]);

	/* Add error data */
	validationErrors.forEach(({ row, errors }) => {
		errorWorksheet.addRow([row, errors.join("; ")]);
	});

	/* Style the headers */
	const headerRow = errorWorksheet.getRow(1);
	headerRow.font = { bold: true };
	headerRow.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: "FFFF0000" },
	};

	/* Auto-fit columns */
	errorWorksheet.columns.forEach((column) => {
		column.width = 30;
	});

	/* Generate buffer */
	const errorBuffer = await errorWorkbook.xlsx.writeBuffer();
	const buffer = Buffer.from(errorBuffer);

	/* Set response headers */
	response.setHeader(
		"Content-Type",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	);
	response.setHeader(
		"Content-Disposition",
		'attachment; filename="validation-errors.xlsx"'
	);
	response.setHeader("Content-Length", buffer.length.toString());

	/* Send the error file */
	response.status(422).send(buffer);
}
