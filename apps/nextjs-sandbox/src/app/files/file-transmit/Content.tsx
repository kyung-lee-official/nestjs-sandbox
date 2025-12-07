"use client";

import axios from "axios";
import React, { useState } from "react";
import { UploadFilesArray } from "./UploadFilesArray";
import { UploadFilesAny } from "./UploadFilesAny";

const DownloadBlob = () => {
	const [progress, setProgress] = useState<string>("0%");
	const [image, setImage] = useState<string>();
	return (
		<div className="flex flex-col justify-center items-start gap-2">
			<h1 className="text-lg">Download Blob</h1>
			<p>
				Throttle down your network in the dev tools to test this
				feature.
			</p>
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={async () => {
					const blob = await axios.get(
						`${process.env.NEXT_PUBLIC_NESTJS}/techniques/file-download`,
						{
							responseType: "blob",
							onDownloadProgress: (progressEvent) => {
								const percentCompleted = progressEvent.progress
									? (progressEvent.progress * 100).toFixed(
											2
									  ) + "%"
									: "0%";
								setProgress(percentCompleted);
							},
						}
					);
					setImage(URL.createObjectURL(blob.data));
				}}
			>
				Download
			</button>
			<div>{progress}</div>
			{image && <img src={image} alt="downloaded" />}
		</div>
	);
};

const UploadFile = () => {
	const [progress, setProgress] = useState<string>("0%");
	return (
		<div className="flex flex-col justify-center items-start gap-2">
			<h1 className="text-lg">Upload File</h1>
			<p>The file is uploaded in multipart/form-data format.</p>
			<p>
				Throttle down your network in the dev tools to test this
				feature. The file will be uploaded to the server, check it out
				in the server&apos;s file system.
			</p>
			<form
				method="put"
				onSubmit={async (e: any) => {
					e.preventDefault();
					const file = e.target.file.files[0];
					console.log(file);
					axios.put(
						`${process.env.NEXT_PUBLIC_NESTJS}/techniques/file-upload`,
						{ file: file },
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
							onUploadProgress: (progressEvent) => {
								const percentCompleted = progressEvent.progress
									? (progressEvent.progress * 100).toFixed(
											2
									  ) + "%"
									: "0%";
								setProgress(percentCompleted);
							},
						}
					);
				}}
			>
				<input type="file" name="file" />
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					type="submit"
				>
					Upload
				</button>
			</form>
			<div>{progress}</div>
		</div>
	);
};

const UploadBlob = () => {
	const [progress, setProgress] = useState<string>("0%");
	return (
		<div className="flex flex-col justify-center items-start gap-2">
			<h1 className="text-lg">Upload Blob</h1>
			<p>The blob is uploaded in multipart/form-data format.</p>
			<p>
				Throttle down your network in the dev tools to test this
				feature. The file will be uploaded to the server, check it out
				in the server&apos;s file system.
			</p>
			<p>
				This is useful if you need to convert a canvas to a blob for
				uploading. The key is to convert the blob to a file.
			</p>
			<p>
				For simplicity, we select a file and convert it to a blob
				instead of using a canvas here.
			</p>
			<form
				method="put"
				onSubmit={async (e: any) => {
					e.preventDefault();
					const file = e.target.file.files[0];
					const blob = new Blob([file]);
					const fileFromBlob = new File([blob], file.name);
					axios.put(
						`${process.env.NEXT_PUBLIC_NESTJS}/techniques/file-upload`,
						{ file: fileFromBlob },
						{
							headers: {
								"Content-Type": "multipart/form-data",
							},
							onUploadProgress: (progressEvent) => {
								const percentCompleted = progressEvent.progress
									? (progressEvent.progress * 100).toFixed(
											2
									  ) + "%"
									: "0%";
								setProgress(percentCompleted);
							},
						}
					);
				}}
			>
				<input type="file" name="file" />
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					type="submit"
				>
					Upload
				</button>
			</form>
			<div>{progress}</div>
		</div>
	);
};

const Content = () => {
	return (
		<div className="flex flex-col gap-10 p-10 w-1/2">
			<DownloadBlob />
			<hr />
			<UploadFile />
			<hr />
			<UploadBlob />
			<hr />
			<UploadFilesArray />
			<hr />
			<UploadFilesAny />
		</div>
	);
};

export default Content;
