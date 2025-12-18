import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { jwtSecret } from "../jwt-secret";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: "2m" });

  const response = NextResponse.json({
    message:
      "Logged in successfully, your token is set in an HTTP-only cookie.",
  });

  response.cookies.set("http-only-cookie-token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 2 * 60, // 2 minutes
  });

  return response;
}
