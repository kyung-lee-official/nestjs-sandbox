import {
  StorePaymentCollectionResponse,
  StorePaymentProviderListResponse,
} from "@medusajs/types";
import api from "../../axios-error-handling-for-medusa/axios-client";

export async function createPaymentCollection(cartId: string) {
  const data = await api.post<StorePaymentCollectionResponse>(
    `/store/payment-collections`,
    {
      cart_id: cartId,
    },
  );
  return data;
}

export async function listPaymentProviders(regionId: string) {
  const data = await api.get<StorePaymentProviderListResponse>(
    `/store/payment-providers?region_id=${regionId}`,
  );
  return data;
}

export async function initializePaymentSession(
  paymentCollectionId: string,
  providerId: string,
) {
  const data = await api.post<StorePaymentCollectionResponse>(
    `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
    {
      provider_id: providerId,
    },
  );
  return data;
}
