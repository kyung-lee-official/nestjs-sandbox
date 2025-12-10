import { type NextRequest, NextResponse } from "next/server";

/* This function can be marked `async` if using `await` inside */
export async function proxy(request: NextRequest) {
  console.log("hello from proxy.ts");
  return NextResponse.next();
  // return NextResponse.redirect(new URL("/home", request.url));
}

// export const config = {
// 	matcher: "/about/:path*",
// };
