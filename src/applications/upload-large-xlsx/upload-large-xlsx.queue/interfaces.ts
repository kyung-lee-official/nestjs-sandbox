export interface ProcessFileJobData {
	taskId: number;
	fileBuffer: Buffer | { data: number[] } | any;
	fileName: string;
}

export interface ValidateChunkJobData {
	taskId: number;
	chunk: Array<{
		rowNumber: number;
		data: {
			name: string;
			gender: string;
			bioId: string;
		};
	}>;
	chunkIndex: number;
	totalChunks: number;
}

export interface SaveChunkJobData {
	taskId: number;
	validData: Array<{
		name: string;
		gender: string;
		bioId: string;
	}>;
	chunkIndex: number;
	totalChunks: number;
}
