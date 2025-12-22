import { api } from "../../axios-error-handling-for-medusa/axios-client";

export async function authenticateCustomer(email: string, password: string) {
  const res = await api.post(
    `/auth/sign-in/customer/emailpass`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    },
  );
  return res.data;
}

export async function signOutCustomer() {
  const res = await api.delete(`/auth/sign-out`, {
    withCredentials: true,
  });
  return res.data;
}
