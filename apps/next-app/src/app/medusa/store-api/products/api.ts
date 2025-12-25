import type { StoreProductListResponse } from "@medusajs/types";
import api from "../../axios-error-handling-for-medusa/axios-client";

export async function getProduts() {
  const data = await api.get<StoreProductListResponse>(`/store/products`);
  return data;
}
