import axios from "axios";

export enum PaymentQK {
  GET_PAYMENT_COLLECTION_BY_ID = "get-payment-collection-by-id",
  GET_PAYMENT_COLLECTION_BY_CART_ID = "get-payment-collection-by-cart-id",
  GET_PAYMENT_PROVIDERS_BY_REGION_ID = "get-payment-providers-by-region-id",
  GET_PAYMENT_SESSION_BY_PAYMENT_COLLECTION_ID = "get-payment-session-by-payment-collection-id",
  GET_PAYMENT_BY_ID = "get-payment-by-id",
}

export async function getPaymentCollectionById(paymentCollectionId: string) {
  const res = await axios.get(
    `/commerce-modules/payment/payment-collection/${paymentCollectionId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}

export async function getPaymentCollectionByCartId(cartId: string) {
  const res = await axios.get(
    `/commerce-modules/payment/payment-collection/get-payment-collection-by-cart-id/${cartId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}

export async function getPaymentProvidersByRegionId(regionId: string) {
  const res = await axios.get(
    `/commerce-modules/payment/payment-provider/get-payment-providers-by-region-id/${regionId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}

export async function createPaymentSession(
  paymentCollectionId: string,
  paymentProviderId: string,
) {
  const res = await axios.post(
    `/commerce-modules/payment/payment-session/create-payment-session`,
    {
      payment_collection_id: paymentCollectionId,
      provider_id: paymentProviderId,
    },
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}

export async function getPaymentSessionByPaymentCollectionId(
  paymentCollectionId: string,
) {
  const res = await axios.get(
    `/commerce-modules/payment/payment-session/get-payment-session-by-payment-collection-id/${paymentCollectionId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}

export async function authorizePaymentSession(paymentSessionId: string) {
  const res = await axios.post(
    `/commerce-modules/payment/payment-session/authorize-payment-session/${paymentSessionId}`,
    {},
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}

export async function getPaymentById(paymentId: string) {
  const res = await axios.get(
    `/commerce-modules/payment/get-payment-by-id/${paymentId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}
