"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/currency";
import { getOrder } from "../api";

type ContentProps = {
  orderId: string;
};

const Content = ({ orderId }: ContentProps) => {
  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
  });

  if (orderQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="h-4 w-1/4 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (orderQuery.isError) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 font-semibold text-lg text-red-800">
            Error Loading Order
          </h2>
          <p className="text-red-700">
            {orderQuery.error instanceof Error
              ? orderQuery.error.message
              : "Failed to load order details"}
          </p>
        </div>
      </div>
    );
  }

  const order = orderQuery.data?.order;
  if (!order) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-gray-500">No order data available</p>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      case "requires_action":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "captured":
        return "bg-green-100 text-green-800 border-green-200";
      case "awaiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "not_paid":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFulfillmentStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "bg-green-100 text-green-800 border-green-200";
      case "partially_fulfilled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "not_fulfilled":
        return "bg-red-100 text-red-800 border-red-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Raw Data (Debug) */}
      <details>
        <summary className="cursor-pointer text-gray-500 text-sm">
          Raw Order Data (for debugging)
        </summary>
        <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs">
          {JSON.stringify(order, null, 2)}
        </pre>
      </details>

      {/* Order Header */}
      <div className="border-b pb-4">
        <h1 className="font-bold text-3xl">Order Details</h1>
        <p className="mt-2 text-gray-600">
          Order #{order.display_id || order.id}
        </p>
      </div>

      {/* Order Status */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-xl">Order Status</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-medium text-gray-700 text-sm">
              Order Status
            </label>
            <span
              className={`inline-flex rounded-full border px-3 py-1 font-medium text-sm ${getStatusBadgeColor(order.status)}`}
            >
              {order.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-700 text-sm">
              Payment Status
            </label>
            <span
              className={`inline-flex rounded-full border px-3 py-1 font-medium text-sm ${getPaymentStatusColor(order.payment_status)}`}
            >
              {order.payment_status.replace("_", " ").toUpperCase()}
            </span>
          </div>
          <div>
            <label className="mb-2 block font-medium text-gray-700 text-sm">
              Fulfillment Status
            </label>
            <span
              className={`inline-flex rounded-full border px-3 py-1 font-medium text-sm ${getFulfillmentStatusColor(order.fulfillment_status)}`}
            >
              {order.fulfillment_status.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-xl">Order Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block font-medium text-gray-700 text-sm">
              Order ID
            </label>
            <p className="mt-1 font-mono text-gray-900 text-sm">{order.id}</p>
          </div>
          <div>
            <label className="block font-medium text-gray-700 text-sm">
              Currency
            </label>
            <p className="mt-1 text-gray-900">
              {order.currency_code.toUpperCase()}
            </p>
          </div>
          <div>
            <label className="block font-medium text-gray-700 text-sm">
              Created At
            </label>
            <p className="mt-1 text-gray-900 text-sm">
              {dayjs(order.created_at).format("YYYY-MM-DD HH:mm:ss")}
            </p>
          </div>
          <div>
            <label className="block font-medium text-gray-700 text-sm">
              Updated At
            </label>
            <p className="mt-1 text-gray-900 text-sm">
              {dayjs(order.updated_at).format("YYYY-MM-DD HH:mm:ss")}
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-xl">Order Summary</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border-blue-500 border-l-4 bg-blue-50 p-4">
            <label className="block font-medium text-blue-700 text-sm">
              Subtotal
            </label>
            <p className="mt-1 font-semibold text-blue-900 text-lg">
              {formatCurrency(order.subtotal ?? 0, order.currency_code)}
            </p>
          </div>
          <div className="rounded-lg border-green-500 border-l-4 bg-green-50 p-4">
            <label className="block font-medium text-green-700 text-sm">
              Tax Total
            </label>
            <p className="mt-1 font-semibold text-green-900 text-lg">
              {formatCurrency(order.tax_total ?? 0, order.currency_code)}
            </p>
          </div>
          <div className="rounded-lg border-purple-500 border-l-4 bg-purple-50 p-4">
            <label className="block font-medium text-purple-700 text-sm">
              Shipping Total
            </label>
            <p className="mt-1 font-semibold text-lg text-purple-900">
              {formatCurrency(order.shipping_total ?? 0, order.currency_code)}
            </p>
          </div>
          <div className="rounded-lg border-orange-500 border-l-4 bg-orange-50 p-4">
            <label className="block font-medium text-orange-700 text-sm">
              Total
            </label>
            <p className="mt-1 font-semibold text-lg text-orange-900">
              {formatCurrency(order.total ?? 0, order.currency_code)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-xl">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="rounded border bg-gray-50 p-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.title || item.product_title}
                    </h3>
                    {item.variant_title && (
                      <p className="text-gray-600 text-sm">
                        {item.variant_title}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-gray-600 text-sm">
                      <span>Quantity: {item.quantity}</span>
                      <span>
                        Unit Price:{" "}
                        {formatCurrency(
                          item.unit_price ?? 0,
                          order.currency_code,
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(
                        (item.unit_price ?? 0) * (item.quantity ?? 1),
                        order.currency_code,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Information */}
      {order.customer && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-xl">Customer Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block font-medium text-gray-700 text-sm">
                Email
              </label>
              <p className="mt-1 text-gray-900">
                {order.customer.email || order.email}
              </p>
            </div>
            {(order.customer.first_name || order.customer.last_name) && (
              <div>
                <label className="block font-medium text-gray-700 text-sm">
                  Name
                </label>
                <p className="mt-1 text-gray-900">
                  {[order.customer.first_name, order.customer.last_name]
                    .filter(Boolean)
                    .join(" ")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
