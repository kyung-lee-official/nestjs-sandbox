"use client";

import type { StoreCart } from "@medusajs/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { useMIdStore } from "@/stores/medusa/medusa-entity-id";
import { formatCurrency } from "@/utils/currency";
import { QK_CART, removeLineItem, updateLineItem } from "../api";

export const CartLineItem = ({ cart }: { cart: StoreCart }) => {
  const queryClient = useQueryClient();
  const cartId = useMIdStore((state) => state.cartId);
  const regionId = useMIdStore((state) => state.regionId);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const removeLineItemMutation = useMutation({
    mutationFn: ({
      cartId,
      lineItemId,
    }: {
      cartId: string;
      lineItemId: string;
    }) => removeLineItem(cartId, lineItemId),
    onSuccess: () => {
      // Invalidate and refetch cart data after successful deletion
      queryClient.invalidateQueries({
        queryKey: [QK_CART.GET_CART, cartId, regionId],
      });
    },
    onError: (error) => {
      console.error("Failed to remove line item:", error);
    },
  });

  const updateLineItemMutation = useMutation({
    mutationFn: ({
      cartId,
      lineItemId,
      quantity,
    }: {
      cartId: string;
      lineItemId: string;
      quantity: number;
    }) => updateLineItem(cartId, lineItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QK_CART.GET_CART, cartId, regionId],
      });
    },
    onError: (error) => {
      console.error("Failed to update line item:", error);
    },
  });

  const handleRemoveItem = (lineItemId: string) => {
    if (!cartId) return;
    removeLineItemMutation.mutate({ cartId, lineItemId });
  };

  const getCurrentQuantity = (itemId: string, defaultQuantity: number) => {
    return quantities[itemId] !== undefined
      ? quantities[itemId]
      : defaultQuantity;
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
    if (cartId) {
      updateLineItemMutation.mutate({
        cartId,
        lineItemId: itemId,
        quantity: newQuantity,
      });
    }
  };

  const handleQuantityChange = (itemId: string, value: string) => {
    const newQuantity = parseInt(value, 10);
    if (!Number.isNaN(newQuantity) && newQuantity >= 1) {
      setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
    }
  };

  const handleQuantityBlur = (itemId: string) => {
    const currentQuantity = quantities[itemId];
    if (currentQuantity !== undefined && cartId) {
      updateLineItemMutation.mutate({
        cartId,
        lineItemId: itemId,
        quantity: currentQuantity,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-xl">
        Cart Items ({cart.items?.length || 0})
      </h3>
      {cart.items && cart.items.length > 0 ? (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  {item.subtitle && (
                    <p className="text-gray-600 text-sm">{item.subtitle}</p>
                  )}
                  {item.variant_title && (
                    <p className="text-gray-500 text-sm">
                      Variant: {item.variant_title}
                    </p>
                  )}
                  <p className="mt-1 font-medium text-gray-700 text-sm">
                    {formatCurrency(item.unit_price, cart.currency_code)}
                  </p>
                  {item.variant_sku && (
                    <p className="text-gray-400 text-xs">
                      SKU: {item.variant_sku}
                    </p>
                  )}
                </div>
                <div className="space-y-2 text-right">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          getCurrentQuantity(item.id, item.quantity) - 1,
                        )
                      }
                      disabled={
                        updateLineItemMutation.isPending ||
                        getCurrentQuantity(item.id, item.quantity) <= 1
                      }
                      className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={getCurrentQuantity(item.id, item.quantity)}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      onBlur={() => handleQuantityBlur(item.id)}
                      className="w-16 rounded border border-gray-300 px-2 py-1 text-center"
                    />
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          getCurrentQuantity(item.id, item.quantity) + 1,
                        )
                      }
                      disabled={updateLineItemMutation.isPending}
                      className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={removeLineItemMutation.isPending}
                    className="rounded bg-red-500 px-3 py-1 text-white text-xs hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {removeLineItemMutation.isPending
                      ? "Removing..."
                      : "Delete"}
                  </button>
                </div>
              </div>
              {item.thumbnail && (
                <Image
                  width={300}
                  height={300}
                  src={item.thumbnail}
                  alt={item.title}
                  className="mt-2 h-16 w-16 rounded object-cover"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-gray-500">Your cart is empty</p>
      )}
    </div>
  );
};
