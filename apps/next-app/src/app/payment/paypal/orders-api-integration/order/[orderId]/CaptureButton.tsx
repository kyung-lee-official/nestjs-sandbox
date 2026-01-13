"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { captureOrder, PayPalOrderQK } from "../../api";

interface CaptureButtonProps {
  orderId: string;
  disabled?: boolean;
}

export const CaptureButton = ({ orderId, disabled }: CaptureButtonProps) => {
  const queryClient = useQueryClient();

  const captureMutation = useMutation({
    mutationFn: () => captureOrder(orderId),
    onSuccess: (data) => {
      /* Invalidate the order query to refresh the order details */
      queryClient.invalidateQueries({
        queryKey: [PayPalOrderQK.GET_ORDER_BY_ID, orderId],
      });

      /* Show success message */
      console.log("Order captured successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to capture order:", error);
    },
  });

  const handleCapture = () => {
    captureMutation.mutate();
  };

  return (
    <button
      onClick={handleCapture}
      disabled={disabled || captureMutation.isPending}
      className={`w-full rounded-lg px-4 py-3 font-medium transition-colors ${
        disabled || captureMutation.isPending
          ? "cursor-not-allowed bg-gray-300 text-gray-500"
          : "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      }`}
    >
      {captureMutation.isPending ? (
        <div className="flex items-center justify-center">
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-white border-b-2"></div>
          Capturing...
        </div>
      ) : (
        "Capture Payment"
      )}
    </button>
  );
};
