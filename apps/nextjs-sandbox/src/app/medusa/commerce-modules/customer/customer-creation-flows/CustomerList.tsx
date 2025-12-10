"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Table, Tbody, Thead } from "@/app/styles/basic/table/table/Table";
import { CustomerQK, getCustomerList } from "../api";
import { Carts } from "./Carts";
import { DeleteCustomer } from "./DeleteCustomer";

export const CustomerList = () => {
  const getCustomerListQuery = useQuery({
    queryKey: [CustomerQK.GET_CUSTOMER_LIST],
    queryFn: async () => {
      const res = await getCustomerList();
      return res;
    },
  });

  if (getCustomerListQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (getCustomerListQuery.isError) {
    return <div>Error loading customers.</div>;
  }

  return (
    <div>
      <h1>Customer List</h1>
      <div className="bg-neutral-500">
        <Table>
          <Thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Carts (per region)</th>
              <th></th>
            </tr>
          </Thead>
          <Tbody>
            {getCustomerListQuery.data?.map((customer: any) => (
              <tr key={customer.id}>
                <td>
                  <Link
                    href={`/medusa/commerce-modules/customer/${customer.id}`}
                    className="underline decoration-dotted"
                  >
                    {customer.id}
                  </Link>
                </td>
                <td>{customer.first_name}</td>
                <td>{customer.last_name}</td>
                <td>{customer.email}</td>
                <td>
                  <Carts customerId={customer.id} />
                </td>
                <td>
                  <DeleteCustomer customerId={customer.id} />
                </td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};
