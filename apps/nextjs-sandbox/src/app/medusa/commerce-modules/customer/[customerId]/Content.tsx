"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CustomerQK, getCustomerById } from "../api";
import { Addresses } from "./Addresses";

type ContentProps = {
  customerId: string;
};

export const Content = (props: ContentProps) => {
  const { customerId } = props;

  const customerQuery = useQuery({
    queryKey: [CustomerQK.GET_CUSTOMER_BY_ID, customerId],
    queryFn: async () => {
      const res = await getCustomerById(customerId);
      return res;
    },
  });

  if (customerQuery.isLoading) {
    return <div>Loading Address...</div>;
  }

  if (customerQuery.error) {
    return <div>Error loading address</div>;
  }

  return (
    <div className="m-6 space-y-6">
      <div>
        <div>Customer Id: {customerQuery.data?.id}</div>
        <div>Customer Email: {customerQuery.data?.email}</div>
        <div>Customer First Name: {customerQuery.data?.first_name}</div>
        <div>Customer Last Name: {customerQuery.data?.last_name}</div>
        <div>Customer Phone: {customerQuery.data?.phone}</div>
        <div>
          Created:{" "}
          {customerQuery.data?.created_at &&
            dayjs(customerQuery.data?.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div>
          Updated:{" "}
          {customerQuery.data?.updated_at &&
            dayjs(customerQuery.data?.updated_at).format("YYYY-MM-DD HH:mm:ss")}
        </div>
      </div>
      {customerQuery.data && (
        <Addresses
          addresses={customerQuery.data.addresses}
          customerId={customerId}
        />
      )}
    </div>
  );
};
