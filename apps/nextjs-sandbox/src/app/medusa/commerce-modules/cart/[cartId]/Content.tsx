"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CartQK, getCartById } from "../api";

export const Content = () => {
  const { cartId } = useParams();

  const cartQuery = useQuery({
    queryKey: [CartQK.GET_CART_BY_ID, cartId],
    queryFn: async () => {
      const res = await getCartById(cartId as string);
      return res;
    },
  });

  if (cartQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (cartQuery.isError) {
    return <div>Error loading cart.</div>;
  }

  return (
    <div className="m-6 space-y-4">
      <div>Cart ID: {cartId}</div>
      <div>Region ID: {cartQuery.data.region_id}</div>
      <div>Region Name: {cartQuery.data.region_name}</div>
      <div>Sales Channel ID: {cartQuery.data.sales_channel_id}</div>
      <div>Sales Channel Name: {cartQuery.data.sales_channel_name}</div>
      <div>Customer ID: {cartQuery.data.customer_id}</div>
      <div>Email: {cartQuery.data.email}</div>
      <div>Currency Code: {cartQuery.data.currency_code}</div>
      <div>
        Created At: {new Date(cartQuery.data.created_at).toLocaleString()}
      </div>
      <div>
        Updated At: {new Date(cartQuery.data.updated_at).toLocaleString()}
      </div>
      <div>Billing Address ID: {cartQuery.data.billing_address_id}</div>
      <div>Shipping Address ID: {cartQuery.data.shipping_address_id}</div>
      <div>
        Completed At:{" "}
        {cartQuery.data.completed_at
          ? new Date(cartQuery.data.completed_at).toLocaleString()
          : "Not completed"}
      </div>
      <div>
        Metadata:{" "}
        {cartQuery.data.metadata
          ? JSON.stringify(cartQuery.data.metadata)
          : "No metadata"}
      </div>
      {cartQuery.data.payment_collection.id && (
        <div
          className="p-3 rounded
					border border-dashed border-neutral-400"
        >
          Payment Collection ID:{" "}
          <Link
            href={`/medusa/commerce-modules/payment/payment-collection/${cartQuery.data.payment_collection.id}`}
            className="underline decoration-dotted"
          >
            {cartQuery.data.payment_collection.id}
          </Link>
        </div>
      )}
      <h2>Raw Data</h2>
      <details>
        <summary className="cursor-pointer text-blue-600 underline">
          Toggle Raw JSON Data
        </summary>
        <pre className="bg-neutral-100 p-4 rounded overflow-x-auto">
          {JSON.stringify(cartQuery.data, null, 2)}
        </pre>
      </details>
    </div>
  );
};
