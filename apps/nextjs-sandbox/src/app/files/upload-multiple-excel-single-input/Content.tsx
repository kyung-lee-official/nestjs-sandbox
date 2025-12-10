"use client";

import axios from "axios";
import pako from "pako";
import type { FormEvent } from "react";

type ArchiveFile = {
  purpose: string;
  name: string;
  data: number[];
};

export const Content = () => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const fileInput = event.currentTarget.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const files = fileInput.files;
    if (!files || files.length === 0) {
      console.error("No files selected");
      return;
    }

    /* create a single archive with all files */
    const archive: ArchiveFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file!.arrayBuffer();

      archive.push({
        purpose: `file_${i + 1}` /* or use filename as purpose */,
        name: file!.name /* This preserves the original filename */,
        data: Array.from(new Uint8Array(arrayBuffer)),
      });
    }

    /* compress entire archive as single blob */
    const archiveJson = JSON.stringify(archive);
    const compressed = pako.gzip(new TextEncoder().encode(archiveJson));
    const compressedBlob = new Blob([compressed as any], {
      type: "application/gzip",
    });

    try {
      const uploadData = new FormData();
      uploadData.append("compressed_archive", compressedBlob, "files.json.gz");
      uploadData.append("description", "Multiple Excel files upload");
      const res = await axios.post(
        "techniques/upload-compressed-single-blob-single-input",
        uploadData,
        {
          baseURL: process.env.NEXT_PUBLIC_NESTJS,
        },
      );
      if (res.status !== 201) {
        throw new Error("Failed to upload files");
      }
      const result = res.data;
      console.log("Upload successful:", result);
      console.log(
        `Uploaded ${files.length} files:`,
        Array.from(files).map((f) => f.name),
      );
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="flex flex-col gap-1 m-6">
      <h1 className="text-lg">Upload Multiple Excel Files in a Single Input</h1>
      <h3>
        use a single input for multiple files, identified using specific
        strings, compress to a single blob for uploading
      </h3>
      <form className="flex flex-col w-60 gap-2" onSubmit={handleSubmit}>
        <input
          type="file"
          name="multiple_files"
          accept=".xlsx"
          multiple
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
