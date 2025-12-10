"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { Table, Tbody, Thead } from "@/app/styles/basic/table/table/Table";
import { getStockLocationList, StockLocationQK } from "../api";
import { CreateStockLocation } from "./CreateStockLocation";

export const Content = () => {
  const stockLocationQuery = useQuery({
    queryKey: [StockLocationQK.GET_STOCK_LOCATION_LIST],
    queryFn: async () => {
      const res = await getStockLocationList();
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
      <Link
        href={
          "https://docs.medusajs.com/resources/references/medusa-workflows/createStockLocationsWorkflow"
        }
        className="underline decoration-dotted"
      >
        Stock Location Creation Flows
      </Link>
      <CreateStockLocation />
      <div className="bg-neutral-500">
        <Table>
          <Thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </Thead>
          <Tbody>
            {stockLocationQuery.data?.map((sl: any) => (
              <tr key={sl.id}>
                <td>
                  <Link
                    href={`/medusa/commerce-modules/stock-location/${sl.id}`}
                    className="underline decoration-dotted cursor-pointer"
                  >
                    {sl.id}
                  </Link>
                </td>
                <td>{sl.name}</td>
                <td>{sl.description}</td>

                <td>{dayjs(sl.created_at).format("YYYY-MM-DD HH:mm")}</td>
                <td>{dayjs(sl.updated_at).format("YYYY-MM-DD HH:mm")}</td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};
