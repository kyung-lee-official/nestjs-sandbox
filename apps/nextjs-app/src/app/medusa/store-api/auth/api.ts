import { api } from "../../axios-error-handling-for-medusa/axios-client";

export async function authenticateCustomer(email: string, password: string) {
  const res = await api.post(`/auth/customer/emailpass`, {
    email,
    password,
  });
  return res.data;
}
