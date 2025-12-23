import api from "../../axios-error-handling-for-medusa/axios-client";

export async function getProduts(id: string) {
  const data = await api.post(`/store/carts/${id}`);
  return data;
}
