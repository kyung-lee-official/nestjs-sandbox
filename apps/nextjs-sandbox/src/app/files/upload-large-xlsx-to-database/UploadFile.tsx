"use client";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadLargeXlsxFile, UploadLargeXlsxToDatabaseQK } from "./api";
import { validateFile } from "../utils/xlsx";
import { humanReadableSize } from "../utils/file";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

export const UploadFile = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isDragOver, setIsDragOver] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	/* Upload mutation using TanStack Query */
	const uploadMutation = useMutation({
		mutationFn: (file: File) =>
			uploadLargeXlsxFile(file, (progressEvent) => {
				setUploadProgress(progressEvent.progress || 0);
			}),
		onSuccess: (data) => {
			setSelectedFile(null);
			setUploadProgress(0);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			queryClient.invalidateQueries({
				queryKey: [UploadLargeXlsxToDatabaseQK.GET_TASKS],
			});
		},
		onError: (error: any) => {
			console.error("Upload error:", error);

			let errorMessage = "An unexpected error occurred during upload";

			/* Handle axios errors */
			if (error?.isAxiosError) {
				if (error.response) {
					/* Server responded with error status */
					errorMessage =
						error.response.data?.message ||
						`Upload failed with status ${error.response.status}`;
				} else if (error.request) {
					/* Request was made but no response received */
					errorMessage = "Network error: No response from server";
				} else {
					/* Something else happened */
					errorMessage = `Request setup error: ${error.message}`;
				}
			} else if (error?.message) {
				errorMessage = error.message;
			}

			alert(`Upload failed: ${errorMessage}`);
			setUploadProgress(0);
		},
	});

	const handleFileSelect = (file: File) => {
		const validation = validateFile(file);
		if (!validation.valid) {
			alert(validation.error);
			return;
		}
		setSelectedFile(file);
	};

	const handleFileInputChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	};

	const handleDragOver = (event: React.DragEvent) => {
		event.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (event: React.DragEvent) => {
		event.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (event: React.DragEvent) => {
		event.preventDefault();
		setIsDragOver(false);

		const files = event.dataTransfer.files;
		if (files.length > 0) {
			handleFileSelect(files[0]!);
		}
	};

	const handleUpload = () => {
		if (selectedFile) {
			uploadMutation.mutate(selectedFile);
		}
	};

	const handleRemoveFile = () => {
		setSelectedFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">Upload Excel File</h2>

			{/* File Drop Zone */}
			<div
				className={`border-2 border-dashed rounded p-6 text-center ${
					isDragOver
						? "border-blue-500 bg-blue-50"
						: "border-gray-300"
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				{selectedFile ? (
					/* Selected File Display */
					<div className="space-y-3">
						<div>
							<p className="font-medium">{selectedFile.name}</p>
							<p className="text-sm text-gray-500">
								{humanReadableSize(selectedFile.size)}
							</p>
						</div>
						<div className="flex gap-2">
							<button
								onClick={handleUpload}
								disabled={uploadMutation.isPending}
								className={`px-4 py-2 rounded text-white ${
									uploadMutation.isPending
										? "bg-gray-400"
										: "bg-blue-600"
								}`}
							>
								{uploadMutation.isPending
									? "Uploading..."
									: "Upload"}
							</button>
							<button
								onClick={handleRemoveFile}
								disabled={uploadMutation.isPending}
								className="px-4 py-2 rounded bg-gray-200 text-gray-700"
							>
								Remove
							</button>
						</div>
					</div>
				) : (
					/* File Selection Area */
					<div className="space-y-3">
						<p>Drop Excel file here or</p>
						<div>
							<input
								ref={fileInputRef}
								type="file"
								accept=".xlsx,.xls"
								onChange={handleFileInputChange}
								className="hidden"
								id="file-upload"
							/>
							<label
								htmlFor="file-upload"
								className="px-4 py-2 border rounded bg-white cursor-pointer"
							>
								Choose File
							</label>
						</div>
						<p className="text-sm text-gray-500">
							Supports .xlsx and .xls files
						</p>
					</div>
				)}
			</div>

			{/* Upload Progress */}
			{uploadMutation.isPending && (
				<div className="mt-4 p-4 border rounded">
					<div className="flex justify-between mb-2">
						<span>Uploading...</span>
						<span>{uploadProgress}%</span>
					</div>
					<div className="bg-gray-200 rounded h-2">
						<div
							className="bg-blue-600 h-2 rounded"
							style={{ width: `${uploadProgress}%` }}
						></div>
					</div>
				</div>
			)}

			{/* Upload Status */}
			{uploadMutation.isError && (
				<div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
					<strong>Error:</strong> {uploadMutation.error?.message}
				</div>
			)}

			{/* Instructions */}
			<div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400">
				<p className="text-sm text-blue-700">
					Upload your Excel file (.xlsx or .xls) to import data to the
					database.
				</p>
			</div>
		</div>
	);
};
