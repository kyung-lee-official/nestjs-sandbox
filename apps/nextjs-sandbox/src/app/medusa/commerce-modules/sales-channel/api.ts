import axios from "axios";

export enum SalesChannelQK {
	GET_SALES_CHANNEL_LIST = "get-sales-channel-list",
	GET_STOCK_LOCATIONS_BY_SALES_CHANNEL_ID = "get-stock-locations-by-sales-channel-id",
}

export const getSalesChannelList = async () => {
	const res = await axios.get(`/commerce-modules/sales-channel`, {
		baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
		headers: {
			"x-publishable-api-key":
				process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
		},
	});
	return res.data;
};

export const deleteSalesChannel = async (salesChannelId: string) => {
	const res = await axios.delete(
		`/commerce-modules/sales-channel/${salesChannelId}`,
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

export const getStockLocationsBySalesChannelId = async (
	salesChannelId: string
) => {
	const res = await axios.get(
		`/commerce-modules/sales-channel/stock-locations/${salesChannelId}`,
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
