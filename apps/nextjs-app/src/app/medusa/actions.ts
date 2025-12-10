"use server";

import { CookieKey } from "./cookie-keys";

const cookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30 /* 30 days */,
  path: "/",
};

/* server action to set the region cookie */
export async function setRegionCookie(region: string) {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(CookieKey.REGION, region, cookieOptions);
}

/* server action to set customer cookie */
/* setCustomerCookie is used for operations performed by admin on behalf of a customer */
export async function setCustomerCookie(customerId: string) {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(CookieKey.CUSTOMER, customerId, cookieOptions);
}
/* setCustomerFPTokenCookie is used for operations performed by the customer themselves (first-person) */
export async function setCustomerFPTokenCookie(token: string) {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(CookieKey.CUSTOMER_FP_TOKEN, token, cookieOptions);
}

/* server action to set sales channel cookie */
export async function setSalesChannelCookie(salesChannelId: string) {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(CookieKey.SALES_CHANNEL, salesChannelId, cookieOptions);
}
