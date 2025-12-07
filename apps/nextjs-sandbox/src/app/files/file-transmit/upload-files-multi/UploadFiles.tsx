import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FileToUpload } from "./FileToUpload";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FileToPreview } from "./file-to-preview/FileToPreview";
import { getAttachmentListByEventId, UploadFilesQK } from "./api";

export type Item = File | Preview;
export type Preview = {
	name: string;
};

export const UploadFiles = () => {
	const inputRef = useRef<HTMLInputElement>(null);

	/* displayList = serverData + uploadList */
	const [serverData, setServerData] = useState<Preview[]>([]);
	const [uploadList, setUploadList] = useState<File[]>([]);
	const [displayList, setDisplayList] = useState<Item[]>([]);

	const previewQuery = useQuery<Preview[], AxiosError>({
		queryKey: [UploadFilesQK.GET_PREVIEW_FILELIST],
		queryFn: async () => {
			const data = await getAttachmentListByEventId();
			return data;
		},
		retry: false,
		refetchOnWindowFocus: false,
	});
	useEffect(() => {
		if (previewQuery.data) {
			setServerData(previewQuery.data);
		}
	}, [previewQuery.data]);

	async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		const files = e.target.files;
		if (!files) return;
		// console.log(files);
		/* convert FileList to Array so it can be mapped */
		setUploadList(Array.from(files));
	}
	useEffect(() => {
		if (uploadList) {
			setDisplayList([...serverData, ...uploadList]);
		}
	}, [serverData, uploadList]);

	return (
		<div className="flex flex-col justify-center items-start gap-2">
			<button
				className="py-2 px-4
				text-white font-bold
				bg-blue-500 hover:bg-blue-700
				rounded"
				onClick={() => {
					/* clear the input field */
					inputRef.current!.value = "";
					setUploadList([]);
					/* trigger the input field */
					inputRef.current?.click();
				}}
			>
				Upload
			</button>
			<form>
				<input
					type="file"
					multiple
					ref={inputRef}
					onChange={onFileChange}
					className="hidden"
				/>
			</form>
			<div
				className="grid grid-cols-4 justify-items-stretch w-[536px] min-h-32 p-2 gap-6
				bg-black
				rounded-md"
			>
				{displayList.length > 0 &&
					displayList.map((file, i) => {
						if (file instanceof File) {
							return (
								<FileToUpload
									key={i}
									file={file}
									setUploadList={setUploadList}
								/>
							);
						} else {
							return <FileToPreview key={i} preview={file} />;
						}
					})}
			</div>
		</div>
	);
};
