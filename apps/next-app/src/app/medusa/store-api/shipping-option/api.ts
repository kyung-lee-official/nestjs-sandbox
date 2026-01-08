import { StoreShippingOptionListResponse } from "@medusajs/types";
import api from "../../axios-error-handling-for-medusa/axios-client";

export async function getShippingOptions(cartId: string) {
  const data = await api.get<StoreShippingOptionListResponse>(
    `/store/shipping-options?cart_id=${cartId || ""}`,
  );
  return data;
}
