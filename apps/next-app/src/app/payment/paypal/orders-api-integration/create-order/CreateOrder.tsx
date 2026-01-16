"use client";

import { CreateOrderRequest } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createPayPalOrder } from "../api";
import { Form, type OrderFormData } from "./Form";

type CreateOrderProps = {
  paypalAccessToken: string;
};

export const CreateOrder = ({ paypalAccessToken }: CreateOrderProps) => {
  const router = useRouter();

  const createOrderMutation = useMutation({
    mutationFn: async (formData: OrderFormData) => {
      const orderPayload: CreateOrderRequest = {
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

      const data = await createPayPalOrder(paypalAccessToken, orderPayload);
      return data;
    },
    onSuccess: (data) => {
      /* redirect the user to the PayPal approval link */
      if (data.links) {
        const approvalLink = data.links.find(
          (link) => link.rel === "payer-action",
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
      <h2 className="font-semibold text-xl">Order Creation</h2>

      {!hasAccessToken && (
        <div className="rounded border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="mb-2 font-semibold text-yellow-800">
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
    </div>
  );
};
