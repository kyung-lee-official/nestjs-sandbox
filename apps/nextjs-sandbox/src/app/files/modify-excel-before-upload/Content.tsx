"use client";

import axios from "axios";
import { FormEvent } from "react";
import ExcelJS from "exceljs";
import dayjs from "dayjs";

export const Content = () => {
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const file = formData.get("any") as File | null;
		if (!file) {
			throw new Error("File not found");
		}
		try {
			/* read the file, convert the value to ISO8601 format */
			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.load(await file.arrayBuffer());
			const worksheet = workbook.worksheets[0];
			if (!worksheet) {
				throw new Error("Worksheet not found");
			}
			/* read A1 */
			const cellA1 = worksheet.getCell("A1");
			cellA1.value = dayjs(cellA1.text).toISOString();
			/* write to buffSer */
			const modifiedBuffer = await workbook.xlsx.writeBuffer();

			const uploadData = new FormData();
			/* No compression needed for single file */
			uploadData.append(
				"file",
				new Blob([modifiedBuffer], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				}),
				file.name
			);

			const res = await axios.post(
				"techniques/upload-modified-excel",
				uploadData,
				{ baseURL: process.env.NEXT_PUBLIC_NESTJS }
			);

			if (res.status !== 201) {
				throw new Error("Failed to upload files");
			}
			console.log("Upload successful:", res.data);
		} catch (error) {
			console.error("Error uploading files:", error);
		}
	};

	return (
		<div className="flex flex-col gap-1 m-6">
			<h1 className="text-lg">Modify Excel Before Upload</h1>
			<h3>
				Convert &apos;YYYY-MM-DD&apos; to ISO8601 format before
				uploading
			</h3>
			<form className="flex flex-col w-60 gap-2" onSubmit={handleSubmit}>
				<input
					type="file"
					name="any"
					accept=".xlsx,.xls"
					className="border border-gray-300 p-2 rounded"
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white py-2 px-4 rounded"
				>
					Submit
				</button>
			</form>
		</div>
	);
};
