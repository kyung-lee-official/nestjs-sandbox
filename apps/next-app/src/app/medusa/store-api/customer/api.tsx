import api from "../../axios-error-handling-for-medusa/axios-client";

export async function getMe() {
  const data = await api.get(`/store/customers/me`, {
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    },
    withCredentials: true,
  });
  return data;
}
