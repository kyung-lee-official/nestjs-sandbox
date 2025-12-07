import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Item } from "./Item";
import { AliyunOssQK } from "./query-keys";

export const List = () => {
	const query = useQuery({
		queryKey: [AliyunOssQK.ALIYUN_OSS_FILE_LIST_QUERY_KEY],
		queryFn: async () => {
			const res = await axios.get("/api/aliyun-oss/get-file-list");
			return res.data;
		},
	});

	return (
		<div
			className="p-6 space-y-2
			border-b border-neutral-300"
		>
			{query.data?.map((file: any) => (
				<Item key={file.name} file={file} />
			))}
		</div>
	);
};
