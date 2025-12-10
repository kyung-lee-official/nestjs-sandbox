"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { Table, Tbody, Thead } from "@/app/styles/basic/table/table/Table";
import { getInventoryList, InventoryQK } from "./api";

export const Content = () => {
  const inventoryListQuery = useQuery({
    queryKey: [InventoryQK.GET_INVENTORY_LIST],
    queryFn: async () => {
      const res = await getInventoryList();
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
      <h1>
        {/* <Link
					href="/medusa/commerce-modules/inventory"
					className="underline decoration-dotted"
				> */}
        Inventory Module
        {/* </Link> */}
      </h1>
      <div className="bg-neutral-500">
        <Table>
          <Thead>
            <tr>
              <th>ID</th>
              <th>SKU</th>
              <th>Title</th>
              <th>Description</th>
              <th>Requires Shipping</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </Thead>
          <Tbody>
            {inventoryListQuery.data?.map((inv: any) => (
              <tr key={inv.id}>
                <td>
                  <Link
                    href={`/medusa/commerce-modules/inventory/${inv.id}`}
                    className="underline decoration-dotted"
                  >
                    {inv.id}
                  </Link>
                </td>
                <td>{inv.sku}</td>
                <td>{inv.title}</td>
                <td>{inv.description}</td>
                <td>{inv.requires_shipping ? "Yes" : "No"}</td>
                <td>{dayjs(inv.created_at).format("YYYY-MM-DD HH:mm")}</td>
                <td>{dayjs(inv.updated_at).format("YYYY-MM-DD HH:mm")}</td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};
