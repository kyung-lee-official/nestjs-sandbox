"use client";

import { useQuery } from "@tanstack/react-query";
import { listRestaurants, QK } from "./api";

const DisplayRestaurants = () => {
  const listRestaurantsQuery = useQuery({
    queryKey: [QK.LIST_RESTAURANTS],
    queryFn: async () => {
      const res = await listRestaurants();
      console.log(res);
      return res;
    },
  });

  return (
    <div>
      <h1>Restaurant List</h1>
      <ul>
        {/* {listRestaurantsQuery.data?.map((restaurant) => (
					<li key={restaurant.id}>{restaurant.name}</li>
				))} */}
      </ul>
    </div>
  );
};

export default DisplayRestaurants;
