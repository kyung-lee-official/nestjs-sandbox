"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrderById, PayPalOrderQK } from "../../api";
import { CaptureButton } from "./CaptureButton";

type ContentProps = {
  orderId: string;
};

export const Content = ({ orderId }: ContentProps) => {
  const orderQuery = useQuery({
    queryKey: [PayPalOrderQK.GET_ORDER_BY_ID, orderId],
    queryFn: async () => {
      const result = await getOrderById(orderId);
      return result;
    },
    enabled: !!orderId,
  });

  if (orderQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-blue-600 border-b-2"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (orderQuery.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h1 className="mb-4 font-bold text-2xl text-gray-900">
            Error Loading Order
          </h1>
          <p className="mb-6 text-gray-600">
            Unable to load order details. Please check the order ID and try
            again.
          </p>
          <button
            onClick={() => orderQuery.refetch()}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const order = orderQuery.data;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 text-white">
            <h1 className="font-bold text-2xl">PayPal Order Details</h1>
            <p className="text-blue-100">Order ID: {orderId}</p>
          </div>

          {/* Order Information */}
          <div className="space-y-6 p-6">
            {/* Status and Intent */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">Status</h3>
                <span
                  className={`inline-block rounded-full px-3 py-1 font-medium text-sm ${
                    order?.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : order?.status === "APPROVED"
                        ? "bg-blue-100 text-blue-800"
                        : order?.status === "CREATED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order?.status || "Unknown"}
                </span>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 font-semibold text-gray-900">Intent</h3>
                <span className="text-gray-700">{order?.intent || "N/A"}</span>
              </div>
            </div>

            {/* Capture Payment Section - Only show for APPROVED orders with AUTHORIZE intent */}
            {order?.status === "APPROVED" && order?.intent === "AUTHORIZE" && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-6">
                <div className="mb-4">
                  <h3 className="mb-2 font-semibold text-green-900">
                    Payment Authorized
                  </h3>
                  <p className="text-green-700 text-sm">
                    The customer has authorized this payment. You can now
                    capture the funds to complete the transaction.
                  </p>
                </div>
                <CaptureButton orderId={orderId} />
              </div>
            )}

            {/* Purchase Units */}
            {order?.purchase_units && (
              <div>
                <h3 className="mb-4 font-semibold text-gray-900">
                  Purchase Units
                </h3>
                {order.purchase_units.map((unit) => (
                  <div
                    key={unit.reference_id}
                    className="mb-4 rounded-lg border p-4"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium text-gray-900">
                          Amount
                        </h4>
                        <p className="font-bold text-2xl text-gray-900">
                          {unit.amount?.currency_code} {unit.amount?.value}
                        </p>
                      </div>
                      {unit.reference_id && (
                        <div>
                          <h4 className="mb-2 font-medium text-gray-900">
                            Reference ID
                          </h4>
                          <p className="font-mono text-gray-700 text-sm">
                            {unit.reference_id}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Links/Actions */}
            {order?.links && (
              <div>
                <h3 className="mb-4 font-semibold text-gray-900">
                  Available Actions
                </h3>
                <div className="space-y-2">
                  {order.links.map((link) => {
                    return (
                      <div
                        key={`${link.method}-${link.href}`}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div>
                          <span className="font-medium text-gray-900 capitalize">
                            {link.rel.replace(/-/g, " ")}
                          </span>
                          <span className="ml-2 rounded bg-gray-200 px-2 py-1 text-gray-500 text-sm">
                            {link.method}
                          </span>
                        </div>
                        {link.rel === "payer-action" && (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700"
                          >
                            Pay Now
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Raw Data (for debugging) */}
            <details className="rounded-lg border">
              <summary className="cursor-pointer bg-gray-50 p-4 font-medium text-gray-900 hover:bg-gray-100">
                Raw Order Data (Debug)
              </summary>
              <pre className="overflow-auto bg-gray-900 p-4 text-green-400 text-xs">
                {JSON.stringify(order, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};
