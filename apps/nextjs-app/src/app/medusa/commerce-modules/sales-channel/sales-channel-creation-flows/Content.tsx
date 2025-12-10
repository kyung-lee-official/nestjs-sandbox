"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { Table, Tbody, Thead } from "@/app/styles/basic/table/table/Table";
import { getSalesChannelList, SalesChannelQK } from "../api";

export const Content = () => {
  const salesChannelQuery = useQuery({
    queryKey: [SalesChannelQK.GET_SALES_CHANNEL_LIST],
    queryFn: async () => {
      const res = await getSalesChannelList();
      return res;
    },
  });

  if (salesChannelQuery.isLoading) {
    return <div>Loading... </div>;
  }

  if (salesChannelQuery.error) {
    return <div>Error loading sales channels</div>;
  }

  return (
    <div className="m-6 space-y-4">
      <Link
        href={
          "https://docs.medusajs.com/resources/references/medusa-workflows/createSalesChannelsWorkflow"
        }
        className="underline decoration-dotted"
      >
        Sales Channel Creation Flows
      </Link>
      <div className="bg-neutral-500">
        <Table>
          <Thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Is Disabled</th>
              {/* <th>Stock Locations</th> */}
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </Thead>
          <Tbody>
            {salesChannelQuery.data?.map((sc: any) => (
              <tr key={sc.id}>
                <td>{sc.id}</td>
                <td>{sc.name}</td>
                <td>{sc.description}</td>
                <td>{sc.is_disabled ? "Yes" : "No"}</td>
                {/* <td>
									<Link
										href={`/medusa/commerce-modules/sales-channel/get-stock-locations-by-sales-channel-id/${sc.id}`}
										className="underline decoration-dotted"
									>
										Stock Locations
									</Link>
								</td> */}
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
