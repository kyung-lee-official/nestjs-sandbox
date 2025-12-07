"use server";

const cookieOptions = {
	httpOnly: false,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	maxAge: 60 * 60 * 24 * 30 /* 30 days */,
	path: "/",
};

/* server action to set the PayPal access token cookie */
export async function setPayPalAccessTokenCookie(token: string) {
	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();
	cookieStore.set("paypalAccessToken", token, cookieOptions);
}
