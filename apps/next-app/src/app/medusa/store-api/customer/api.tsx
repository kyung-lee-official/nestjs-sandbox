import { StoreCustomerAddressListResponse } from "@medusajs/types";
import api from "../../axios-error-handling-for-medusa/axios-client";

export async function getMe() {
  const data = await api.get(`/store/customers/me`);
  return data;
}

export async function getMyAddresses() {
  const data = await api.get<StoreCustomerAddressListResponse>(
    `/store/customers/me/addresses`,
  );
  return data;
}
