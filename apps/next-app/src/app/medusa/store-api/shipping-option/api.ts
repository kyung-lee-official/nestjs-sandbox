import { StoreShippingOptionListResponse } from "@medusajs/types";
import api from "../../axios-error-handling-for-medusa/axios-client";

export async function getShippingOptions() {
  const data = await api.get<StoreShippingOptionListResponse>(
    `/store/shipping-options`,
  );
  return data;
}
