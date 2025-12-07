import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const res = await axios.get("/restaurants", {
		baseURL: "http://localhost:3101",
		headers: {
			"x-publishable-api-key":
				request.headers.get("x-publishable-api-key") || "",
		},
	});
	return NextResponse.json(res.data);
}
