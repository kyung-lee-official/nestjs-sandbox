import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { jwtSecret } from "../jwt-secret";

export async function GET(req: NextRequest) {
  /* verify token from http-only cookie */
  const token = req.cookies.get("http-only-cookie-token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: "No token provided." }), {
      status: 401,
    });
  }

  const payload = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

  if (!payload || !payload.email) {
    return new Response(JSON.stringify({ message: "Invalid token." }), {
      status: 401,
    });
  }

  return new Response(
    JSON.stringify({
      message:
        "You found the secret! This is a secret can only be accessed with a valid token.",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
