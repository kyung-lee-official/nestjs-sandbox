import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from "@nestjs/swagger";

export const uploadXlsxApiOperation: ApiOperationOptions = {
	summary: "Upload XLSX file",
	description: "Upload an XLSX file and process the data into database batches",
};

export const uploadXlsxApiBody: ApiBodyOptions = {
	schema: {
		type: "object",
		properties: {
			file: {
				type: "string",
				format: "binary",
				description: "XLSX file to upload",
			},
		},
	},
};

export const getBatchesApiOperation: ApiOperationOptions = {
	summary: "Get all batches",
	description: "Retrieve all upload batches with their data and record counts",
};

export const deleteDataByBatchIdApiOperation: ApiOperationOptions = {
	summary: "Delete data by batch ID",
	description: "Delete all data entries and the batch itself for the specified batch ID",
};

export const deleteDataByBatchIdApiParam: ApiParamOptions = {
	name: "batchId",
	type: "number",
	description: "The ID of the batch to delete",
};