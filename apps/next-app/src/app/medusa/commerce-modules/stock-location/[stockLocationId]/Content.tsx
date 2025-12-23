"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { Table, Tbody, Thead } from "@/app/styles/basic/table/table/Table";
import {
  getStockLocationById,
  getStockLocationList,
  StockLocationQK,
} from "../api";

type ContentProps = {
  stockLocationId: string;
};

export const Content = (props: ContentProps) => {
  const { stockLocationId } = props;
  const stockLocationQuery = useQuery({
    queryKey: [StockLocationQK.GET_STOCK_LOCATION_BY_ID, stockLocationId],
    queryFn: async () => {
      const res = await getStockLocationById(stockLocationId);
      return res;
    },
  });

  if (stockLocationQuery.isLoading) {
    return <div>Loading... </div>;
  }

  if (stockLocationQuery.error) {
    return <div>Error loading stock locations</div>;
  }

  return (
    <div className="m-6 space-y-4">
      <h1>
        Stock Location {stockLocationQuery.data?.name} ({stockLocationId})
        Details
      </h1>
      <div>Address: {stockLocationQuery.data?.address?.id}</div>
      <div>
        Created At{" "}
        {dayjs(stockLocationQuery.data?.created_at).format("YYYY-MM-DD HH:mm")}
      </div>
      <div>
        Updated At{" "}
        {dayjs(stockLocationQuery.data?.updated_at).format("YYYY-MM-DD HH:mm")}
      </div>
      <div className="bg-neutral-500">
        <h2
          className="p-4
					text-white"
        >
          Sales Channels
        </h2>
        <Table>
          <Thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Is Disabled</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </Thead>
          <Tbody>
            {stockLocationQuery.data?.sales_channels?.map((sc: any) => (
              <tr key={sc.id}>
                <td>{sc.id}</td>
                <td>{sc.name}</td>
                <td>{sc.description}</td>
                <td>{sc.is_disabled ? "Yes" : "No"}</td>
                <td>{dayjs(sc.created_at).format("YYYY-MM-DD HH:mm")}</td>
                <td>{dayjs(sc.updated_at).format("YYYY-MM-DD HH:mm")}</td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};
