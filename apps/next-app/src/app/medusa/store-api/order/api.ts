import { StoreOrderResponse } from "@medusajs/types";
import api from "../../axios-error-handling-for-medusa/axios-client";

export async function getOrder(id: string) {
  const data = await api.get<StoreOrderResponse>(`/store/orders/${id}`);
  return data;
}
