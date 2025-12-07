import { NextRequest } from "next/server";
import { getOSSClient } from "../client";

export async function DELETE(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const filename = searchParams.get("filename");

	const client = await getOSSClient();
	const result = await client.delete(filename);
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
