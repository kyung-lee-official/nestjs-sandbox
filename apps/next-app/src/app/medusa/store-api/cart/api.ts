import type { StoreCartResponse } from "@medusajs/types";
import api from "../../axios-error-handling-for-medusa/axios-client";

export enum QK_CART {
  GET_CART = "get_cart",
  CREATE_CART = "create_cart",
}

export async function getCart(id: string) {
  const data = await api.post<StoreCartResponse>(`/store/carts/${id}`);
  return data;
}

export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity: number = 1,
) {
  const data = await api.post<StoreCartResponse>(
    `/store/carts/${cartId}/line-items`,
    {
      variant_id: variantId,
      quantity: quantity,
    },
  );
  return data;
}

export async function createCart(regionId?: string) {
  const data = await api.post<StoreCartResponse>("/store/carts", {
    region_id: regionId,
  });
  return data;
}
