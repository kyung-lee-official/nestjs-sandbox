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
			className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
				disabled || captureMutation.isPending
					? "bg-gray-300 text-gray-500 cursor-not-allowed"
					: "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
			}`}
		>
			{captureMutation.isPending ? (
				<div className="flex items-center justify-center">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
					Capturing...
				</div>
			) : (
				"Capture Payment"
			)}
		</button>
	);
};
