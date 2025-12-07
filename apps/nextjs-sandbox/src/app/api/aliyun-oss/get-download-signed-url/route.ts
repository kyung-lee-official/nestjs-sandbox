import { getOSSClient } from "../client";

export async function POST(request: Request) {
	const body = await request.json();
	const { fileName } = body as {
		fileName: string;
	};

	const client = await getOSSClient();

	const url = await client.signatureUrlV4(
		"GET",
		600,
		{
			headers: {}, // 请根据实际发送的请求头设置此处的请求头
		},
		fileName
	);

	return new Response(url, {
		status: 200,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
