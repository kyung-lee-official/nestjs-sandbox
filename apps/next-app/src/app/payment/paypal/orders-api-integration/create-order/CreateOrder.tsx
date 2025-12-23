"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Form, type OrderFormData } from "./Form";

type CreateOrderProps = {
  paypalAccessToken?: string;
};

export const CreateOrder = ({ paypalAccessToken }: CreateOrderProps) => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);

  const createOrderMutation = useMutation({
    mutationFn: async (formData: OrderFormData) => {
      const orderPayload = {
        intent: formData.intent,
        purchase_units: [
          {
            reference_id: formData.reference_id,
            amount: {
              currency_code: formData.currency_code,
              value: formData.amount_value,
            },
          },
        ],
        payment_source: {
          paypal: {
            address: {
              address_line_1: formData.address_line_1,
              address_line_2: formData.address_line_2,
              admin_area_1: formData.admin_area_1,
              admin_area_2: formData.admin_area_2,
              postal_code: formData.postal_code,
              country_code: formData.country_code,
            },
            email_address: formData.email_address,
            payment_method_preference: formData.payment_method_preference,
            experience_context: {
              return_url: formData.return_url,
              cancel_url: formData.cancel_url,
            },
          },
        },
      };

      const res = await axios.post(
        "/api/payment/paypal/v2/create-order",
        orderPayload,
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("PayPal order created successfully:", data);
      setOrderData(data);
      /* redirect the user to the PayPal approval link */
      if (data.links) {
        const approvalLink = data.links.find(
          (link: any) => link.rel === "payer-action",
        );
        if (approvalLink) {
          router.push(approvalLink.href);
        }
      }
    },
    onError: (error) => {
      console.error("Error creating PayPal order:", error);
    },
  });

  const hasAccessToken = !!paypalAccessToken;

  const handleFormSubmit = (formData: OrderFormData) => {
    createOrderMutation.mutate(formData);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order Creation</h2>

      {!hasAccessToken && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Access Token Required
          </h3>
          <p className="text-sm text-yellow-700">
            Please generate an access token first before creating orders.
          </p>
        </div>
      )}

      {hasAccessToken && (
        <Form
          onSubmit={handleFormSubmit}
          isLoading={createOrderMutation.isPending}
        />
      )}

      {createOrderMutation.isError && (
        <div className="text-red-500 text-sm">
          Error:{" "}
          {createOrderMutation.error?.message ||
            "Failed to create PayPal order"}
        </div>
      )}

      {orderData && (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            Order Created Successfully:
          </h3>
          <div className="space-y-2 text-sm text-green-700">
            <div>
              <strong>Order ID:</strong>{" "}
              <span className="font-mono">{orderData.id}</span>
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span className="font-mono">{orderData.status}</span>
            </div>
            <div>
              <strong>Intent:</strong>{" "}
              <span className="font-mono">{orderData.intent}</span>
            </div>
            {orderData.links && (
              <div>
                <strong>Actions:</strong>
                <div className="mt-1 space-y-1">
                  {orderData.links.map((link: any, index: number) => (
                    <div key={index} className="text-xs">
                      <span className="font-mono bg-gray-100 px-1 rounded">
                        {link.rel}
                      </span>
                      :{" "}
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all"
                      >
                        {link.href}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
