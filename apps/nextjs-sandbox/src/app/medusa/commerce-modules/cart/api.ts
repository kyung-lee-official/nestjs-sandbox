import axios, { Axios, AxiosResponse } from "axios";

export enum CartQK {
  GET_CART_BY_ID = "get-cart-by-id",
  GET_CART_BY_REGION_ID_AND_SALES_CHANNEL_ID_AND_CUSTOMER_ID = "get-cart-by-region-id-and-sales-channel-id-and-customer-id",
  GET_CART_BY_PAYMENT_COLLECTION_ID = "get-cart-by-payment-collection-id",
  GET_CART_CHECKOUT_INFO_BY_ID = "get-cart-checkout-info-by-id",
  GET_CARTS_BY_CUSTOMER_ID = "get-carts-by-customer-id",
}

export async function getCartById(cartId: string) {
  const res = await axios.get(`/commerce-modules/cart/${cartId}`, {
    baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    },
  });
  return res.data;
}

/**
 * This function tries to get a cart by regionId, salesChannelId and customerId.
 * If no cart exists, it creates a new one.
 * @param regionId
 * @param salesChannelId
 * @param customerId
 * @returns cart info
 */
export async function getCartByRegionIdSalesChannelIdCustomerId(
  regionId: string,
  salesChannelId: string,
  customerId: string,
) {
  const res = await axios.get(
    `/commerce-modules/cart/get-cart-by-region-sales-channel-customer?region_id=${regionId}&sales_channel_id=${salesChannelId}&customer_id=${customerId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}

export async function getCartCheckoutInfoById(cartId: string) {
  const res = await axios.get(
    `/commerce-modules/cart/checkout-info/${cartId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}

export async function getCartByPaymentCollectionId(
  paymentCollectionId: string,
) {
  const res = await axios.get(
    `/commerce-modules/cart/get-cart-by-payment-collection-id/${paymentCollectionId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}

export async function getCartsByCustomerId(customerId: string) {
  const res = await axios.get(
    `/commerce-modules/cart/get-carts-by-customer-id/${customerId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
}

export async function updateCart(cartId: string, payload: any) {
  const res = await axios.put(`/commerce-modules/cart/${cartId}`, payload, {
    baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    },
  });
  return res.data;
}

/* === address === */
export async function linkShippingAddressToCart(
  cartId: string,
  addressId: string,
) {
  const res = await axios.post(
    `/commerce-modules/cart/shipping-address/${cartId}`,
    {
      address_id: addressId,
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

/* === shipping === */

export async function linkShippingMethodToCart(
  cartId: string,
  shippingOptionId: string,
) {
  const res = await axios.post(
    `/commerce-modules/cart/shipping-method/${cartId}`,
    {
      shippingOptionId: shippingOptionId,
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

/* === checkout === */

export async function completePaymentCollection(cartId: string) {
  const res = await axios.post(
    `/commerce-modules/cart/checkout/create-payment-collection/${cartId}`,
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

/* === danger zone === */

export async function forceCompleteCart(cartId: string) {
  const res = await axios.post(
    `/commerce-modules/cart/force-complete-cart/${cartId}`,
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

export async function deleteCart(cartId: string) {
  const res = await axios.delete(`/commerce-modules/cart/${cartId}`, {
    baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    },
  });
  return res.data;
}
