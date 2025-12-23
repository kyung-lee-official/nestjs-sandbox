import axios from "axios";

export enum StockLocationQK {
  GET_STOCK_LOCATION_LIST = "get-stock-location-list",
  GET_STOCK_LOCATION_BY_ID = "get-stock-location-by-id",
}

export const getStockLocationList = async () => {
  const res = await axios.get(`/commerce-modules/stock-location`, {
    baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    },
  });
  return res.data;
};

export const createStockLocation = async (name: string) => {
  const res = await axios.post(
    `/commerce-modules/stock-location`,
    {
      name: name,
    },
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
};

export const getStockLocationById = async (stockLocationId: string) => {
  const res = await axios.get(
    `/commerce-modules/stock-location/${stockLocationId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
};

export const deleteStockLocation = async (stockLocationId: string) => {
  const res = await axios.delete(
    `/commerce-modules/stock-location/${stockLocationId}`,
    {
      baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      },
    },
  );
  return res.data;
};
