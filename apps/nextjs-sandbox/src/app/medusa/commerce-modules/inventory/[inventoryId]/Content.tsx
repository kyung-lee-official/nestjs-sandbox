"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getInventoryById, InventoryQK } from "../api";
import { InventoryLevels } from "./InventoryLevels";

type InventoryProps = {
  inventoryId: string;
};

export const Content = (props: InventoryProps) => {
  const { inventoryId } = props;

  const inventoryListQuery = useQuery({
    queryKey: [InventoryQK.GET_INVENTORY_BY_ID, inventoryId],
    queryFn: async () => {
      const res = await getInventoryById(inventoryId);
      return res;
    },
  });

  if (inventoryListQuery.isLoading) {
    return <div>Loading... </div>;
  }

  if (inventoryListQuery.error) {
    return <div>Error: {inventoryListQuery.error.message}</div>;
  }

  return (
    <div className="flex flex-col m-6">
      <h1>Inventory ID: {inventoryId}</h1>
      <div>SKU: {inventoryListQuery.data?.sku}</div>
      <div>Title: {inventoryListQuery.data?.title}</div>
      <div>Description: {inventoryListQuery.data?.description}</div>
      <div>Origin Country: {inventoryListQuery.data?.origin_country}</div>
      <div>HS Code: {inventoryListQuery.data?.hs_code}</div>
      <div>Material: {inventoryListQuery.data?.material}</div>
      <div>Weight: {inventoryListQuery.data?.weight}</div>
      <div>Length: {inventoryListQuery.data?.length}</div>
      <div>Height: {inventoryListQuery.data?.height}</div>
      <div>Width: {inventoryListQuery.data?.width}</div>
      <div>
        Requires Shipping:{" "}
        {inventoryListQuery.data?.requires_shipping ? "Yes" : "No"}
      </div>
      <div>
        Created At:{" "}
        {dayjs(inventoryListQuery.data?.created_at).format("YYYY-MM-DD HH:mm")}
      </div>
      <div>
        Updated At:{" "}
        {dayjs(inventoryListQuery.data?.updated_at).format("YYYY-MM-DD HH:mm")}
      </div>
      <InventoryLevels
        inventoryLevels={inventoryListQuery.data?.inventory_levels}
      />
      <details>
        <summary className="cursor-pointer">Raw Data</summary>
        <pre className="bg-gray-100 p-4 mt-2 rounded overflow-x-auto">
          {JSON.stringify(inventoryListQuery.data, null, 2)}
        </pre>
      </details>
    </div>
  );
};
