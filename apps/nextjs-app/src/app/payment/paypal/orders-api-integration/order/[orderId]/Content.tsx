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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (orderQuery.isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Order
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to load order details. Please check the order ID and try
            again.
          </p>
          <button
            onClick={() => orderQuery.refetch()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const order = orderQuery.data;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">PayPal Order Details</h1>
            <p className="text-blue-100">Order ID: {orderId}</p>
          </div>

          {/* Order Information */}
          <div className="p-6 space-y-6">
            {/* Status and Intent */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Intent</h3>
                <span className="text-gray-700">{order?.intent || "N/A"}</span>
              </div>
            </div>

            {/* Capture Payment Section - Only show for APPROVED orders with AUTHORIZE intent */}
            {order?.status === "APPROVED" && order?.intent === "AUTHORIZE" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-green-900 mb-2">
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
                <h3 className="font-semibold text-gray-900 mb-4">
                  Purchase Units
                </h3>
                {order.purchase_units.map((unit: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Amount
                        </h4>
                        <p className="text-2xl font-bold text-gray-900">
                          {unit.amount?.currency_code} {unit.amount?.value}
                        </p>
                      </div>
                      {unit.reference_id && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Reference ID
                          </h4>
                          <p className="text-gray-700 font-mono text-sm">
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
                <h3 className="font-semibold text-gray-900 mb-4">
                  Available Actions
                </h3>
                <div className="space-y-2">
                  {order.links.map((link: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                    >
                      <div>
                        <span className="font-medium text-gray-900 capitalize">
                          {link.rel.replace(/-/g, " ")}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          {link.method}
                        </span>
                      </div>
                      {link.rel === "payer-action" && (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Pay Now
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Data (for debugging) */}
            <details className="border rounded-lg">
              <summary className="cursor-pointer p-4 bg-gray-50 font-medium text-gray-900 hover:bg-gray-100">
                Raw Order Data (Debug)
              </summary>
              <pre className="p-4 bg-gray-900 text-green-400 text-xs overflow-auto">
                {JSON.stringify(order, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};
