import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { AliyunOssQK } from "./query-keys";

export const Item = (props: any) => {
  const { file } = props;

  const signatureQuery = useQuery({
    queryKey: ["aliyun-oss-file-signature", file.name],
    queryFn: async () => {
      const res = await axios.post(
        "/api/aliyun-oss/get-download-signed-url",
        {
          fileName: file.name,
          method: "GET",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return res.data;
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.get(signatureQuery.data, {
        headers: {},
      });
      const blob = new Blob([res.data], {
        type: "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return {
        name: file.name,
        url: signatureQuery.data,
      };
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.delete("/api/aliyun-oss/delete-file", {
        params: {
          filename: file.name,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AliyunOssQK.ALIYUN_OSS_FILE_LIST_QUERY_KEY],
      });
    },
  });

  return (
    <div
      className="flex items-center gap-2 justify-between p-2
			bg-neutral-200
			rounded-md"
    >
      <div>{file.name}</div>
      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1
					text-white
					bg-blue-400 hover:bg-blue-500
					rounded cursor-pointer"
          onClick={() => {
            downloadMutation.mutate();
          }}
        >
          Download
        </button>
        <button
          className="px-2 py-1
					text-white
					bg-red-500 hover:bg-red-600
					rounded cursor-pointer"
          onClick={() => {
            deleteMutation.mutate();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
