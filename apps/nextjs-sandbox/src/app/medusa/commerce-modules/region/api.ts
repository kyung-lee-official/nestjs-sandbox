import axios from "axios";

export enum RegionQK {
	GET_REGION_LIST = "get-region-list",
}

export async function getRegions() {
	const res = await axios.get(`/commerce-modules/region`, {
		baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
		headers: {
			"x-publishable-api-key":
				process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
		},
	});
	return res.data;
}
