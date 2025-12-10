"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Table, Tbody, Thead } from "@/app/styles/basic/table/table/Table";
import { getStockLocationsBySalesChannelId, SalesChannelQK } from "../../api";

type StockLocationsProps = {
  salesChannelId: string;
};

export const Content = (props: StockLocationsProps) => {
  const { salesChannelId } = props;

  const getStockLocationsQuery = useQuery({
    queryKey: [SalesChannelQK.GET_STOCK_LOCATIONS_BY_SALES_CHANNEL_ID],
    queryFn: async () => {
      const res = await getStockLocationsBySalesChannelId(salesChannelId);
      return res;
    },
  });

  if (getStockLocationsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (getStockLocationsQuery.error) {
    return <div>Error loading stock locations</div>;
  }

  return (
    <div className="m-6 space-y-4">
      <h1>Stock Locations of Sales Channel {salesChannelId}</h1>
      <div className="bg-neutral-500">
        <Table>
          <Thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </Thead>
          <Tbody>
            {getStockLocationsQuery.data?.map((sl: any) => (
              <tr key={sl.id}>
                <td>{sl.id}</td>
                <td>{sl.name}</td>
                <td>{sl.address}</td>
                <td>{dayjs(sl.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td>{dayjs(sl.updated_at).format("YYYY-MM-DD HH:mm:ss")}</td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};
