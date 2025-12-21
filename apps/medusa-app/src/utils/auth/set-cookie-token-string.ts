import ms from "ms";

export const setCookieTokenString = (token: string) => {
  return `medusa_token=${token}; HttpOnly;${process.env.NODE_ENV === "production" ? "Secure;" : ""} Path=/; Max-Age=${ms(process.env.JWT_EXPIRES_IN as ms.StringValue) / 1000 || 3600}; SameSite=Lax`;
};
