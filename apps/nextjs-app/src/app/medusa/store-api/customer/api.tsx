import { api } from "../../axios-error-handling-for-medusa/axios-client";

export async function getMe(token: string) {
  const res = await api.get(`/store/customers/me`, {
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
