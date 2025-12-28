"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMIdStore } from "@/stores/medusa/medusa-entity-id";
import { addLineItem } from "../../cart/api";

interface AddToCartButtonProps {
  variantId: string;
  variantTitle: string;
}

export const AddToCartButton = ({
  variantId,
  variantTitle,
}: AddToCartButtonProps) => {
  const cartId = useMIdStore((state) => state.cartId);
  const hasHydrated = useMIdStore((state) => state.hasHydrated);
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!cartId) {
        throw new Error("No cart ID available. Please create a cart first.");
      }
      return addLineItem(cartId, variantId, 1);
    },
    onSuccess: () => {
      // Invalidate cart queries to refetch cart data
      queryClient.invalidateQueries({ queryKey: ["get_cart"] });
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  if (!hasHydrated) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleAddToCart}
        disabled={!cartId || addToCartMutation.isPending}
        className={`rounded px-4 py-2 font-medium text-sm transition-colors ${
          !cartId
            ? "cursor-not-allowed bg-gray-300 text-gray-500"
            : addToCartMutation.isPending
              ? "cursor-not-allowed bg-blue-400 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
      </button>
      {addToCartMutation.isError && (
        <div className="text-red-600 text-xs">
          {addToCartMutation.error instanceof Error
            ? addToCartMutation.error.message
            : "Failed to add to cart"}
        </div>
      )}
      {addToCartMutation.isSuccess && (
        <div className="text-green-600 text-xs">Added to cart!</div>
      )}
    </div>
  );
};