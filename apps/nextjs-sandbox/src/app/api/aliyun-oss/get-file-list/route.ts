import { getOSSClient } from "../client";

export async function GET(request: Request) {
	const client = await getOSSClient();
	const result = await client.list();
	return new Response(JSON.stringify(result.objects), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
