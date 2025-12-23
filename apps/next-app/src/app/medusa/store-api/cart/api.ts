import api from "../../axios-error-handling-for-medusa/axios-client";

export async function getCart(id: string) {
  const res = await api.post(`/store/carts/${id}`);
  return res;
}
