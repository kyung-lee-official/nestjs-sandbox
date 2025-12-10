"use server";

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
  cookieStore.set("medusaRegion", region, cookieOptions);
}

/* server action to set customer cookie */
export async function setCustomerCookie(customerId: string) {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set("medusaCustomer", customerId, cookieOptions);
}

/* server action to set sales channel cookie */
export async function setSalesChannelCookie(salesChannelId: string) {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set("medusaSalesChannel", salesChannelId, cookieOptions);
}
