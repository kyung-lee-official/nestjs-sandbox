"use server";

import { cookies } from "next/headers";

export async function getCookieToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("http-only-cookie-token")?.value;
  return { token };
}

export async function signOut() {
  const cookieStore = await cookies();

  // 1. Delete the cookie
  cookieStore.set("http-only-cookie-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  // 2. Redirect to login (this also clears the Server Component cache)
  //   redirect("/login");
}
