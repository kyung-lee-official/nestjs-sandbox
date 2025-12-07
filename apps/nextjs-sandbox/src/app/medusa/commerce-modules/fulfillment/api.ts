import axios from "axios";

export enum FulfillmentQK {
	GET_SHIPPING_OPTIONS_BY_CART_ID = "get_shipping_options_by_cart_id",
	GET_SHIPPING_OPTION_BY_ID = "get_shipping_option_by_id",
}

/* === shipping options === */

export const getShippingOptionsByCartId = async (cartId: string) => {
	const res = await axios.get(
		`/commerce-modules/fulfillment/get-shipping-options-by-cart-id/${cartId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
			headers: {
				"x-publishable-api-key":
					process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
			},
		}
	);
	return res.data;
};

export const getShippingOptionById = async (shippingOptionId: string) => {
	const res = await axios.get(
		`/commerce-modules/fulfillment/get-shipping-option-by-id/${shippingOptionId}`,
		{
			baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
			headers: {
				"x-publishable-api-key":
					process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
			},
		}
	);
	return res.data;
};
