export interface UploadLargeXlsxRowData {
	name: string;
	gender: string;
	bioId: string;
}

export interface ProcessFileJobData {
	taskId: number;
	fileBuffer: Buffer | { data: number[] } | any;
	fileName: string;
}

export interface ValidateChunkJobData {
	taskId: number;
	chunk: Array<{
		rowNumber: number;
		data: UploadLargeXlsxRowData;
	}>;
	chunkIndex: number;
	totalChunks: number;
}

export interface SaveChunkJobData {
	taskId: number;
	validData: Array<UploadLargeXlsxRowData>;
	chunkIndex: number;
	totalChunks: number;
}
