import api from "../../axios-error-handling-for-medusa/axios-client";

export async function authenticateCustomer(email: string, password: string) {
  const data = await api.post(
    `/auth/sign-in/customer/emailpass`,
    {
      email,
      password,
    },
    {
      withCredentials: true,
    },
  );
  return data;
}

export async function signOutCustomer() {
  const data = await api.del(`/auth/sign-out`, {
    withCredentials: true,
  });
  return data;
}
