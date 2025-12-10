import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { AliyunOssQK } from "./query-keys";

type FormValues = {
  files: FileList;
};

export const Upload = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const mutation = useMutation({
    mutationFn: async (files: FileList) => {
      if (!files || files.length === 0) {
        console.error("No files selected");
        return;
      }
      for (const file of files) {
        const res = await axios.post(
          "/api/aliyun-oss/get-upload-signed-url",
          {
            fileName: file.name,
            method: "PUT", // Use PUT for uploading files
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        console.log(res.data);
        const ossRes = await axios.put(res.data, file, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });
      }
      return Array.from(files).map((file) => file.name);
    },
    onSuccess: (data) => {
      console.log("Uploaded files:", data);
      queryClient.invalidateQueries({
        queryKey: [AliyunOssQK.ALIYUN_OSS_FILE_LIST_QUERY_KEY],
      });
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    const files = inputRef.current?.files;
    if (files && files.length > 0) {
      mutation.mutate(files);
    }
  };

  return (
    <form
      className="p-6 space-y-4
			border-b border-neutral-300"
    >
      <input
        type="file"
        multiple
        ref={(e) => {
          register("files").ref(e);
          inputRef.current = e;
        }}
        className="block w-fit px-2
				bg-neutral-300"
      />
      <button
        type="submit"
        className="px-1.5
				text-white
				bg-blue-500
				rounded"
        onClick={handleSubmit(onSubmit)}
      >
        {mutation.isPending ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
};
