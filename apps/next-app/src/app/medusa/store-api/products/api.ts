import type {
  StoreProductListResponse,
  StoreProductResponse,
} from "@medusajs/types";
import api from "../../axios-error-handling-for-medusa/axios-client";

export async function getProduts() {
  const data = await api.get<StoreProductListResponse>(`/store/products`);
  return data;
}

export async function getProductById(productId: string) {
  const data = await api.get<StoreProductResponse>(
    `/store/products/${productId}`,
  );
  return data;
}
