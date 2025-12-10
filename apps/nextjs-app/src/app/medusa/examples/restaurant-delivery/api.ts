import axios from "axios";

export const QK = {
  LIST_RESTAURANTS: "list-restaurants",
};

export const listRestaurants = async () => {
  const res = await axios.get("/restaurants", {
    baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    },
  });
  return res.data;
};

// export const listRestaurants = async () => {
// 	const res = await axios.get(
// 		"/api/medusa/examples/restaurant-delivery/restaurants",
// 		{
// 			headers: {
// 				"x-publishable-api-key":
// 					process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
// 			},
// 		}
// 	);
// 	return res.data;
// };

export const createRestaurant = async (data: {
  name: string;
  handle: string;
  address: string;
  phone: string;
  email: string;
}) => {
  const res = await axios.post("/restaurants", data, {
    baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    },
  });
  return res.data;
};
