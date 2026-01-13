"use client";

import type { StoreCartPromotion, StoreCartResponse } from "@medusajs/types";
import { useState } from "react";
import { addPromotions, removePromotions } from "../api";

interface CartPromotionsProps {
  cart: StoreCartResponse;
  onCartUpdate?: (updatedCart: StoreCartResponse) => void;
}

export default function CartPromotions({
  cart,
  onCartUpdate,
}: CartPromotionsProps) {
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddPromotion = async () => {
    if (!promoCode.trim()) {
      setError("Please enter a promo code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await addPromotions(cart.cart.id, promoCode.trim());
      setPromoCode("");
      onCartUpdate?.(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add promotion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePromotion = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedCart = await removePromotions(cart.cart.id, code);
      onCartUpdate?.(updatedCart);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove promotion",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleAddPromotion();
    }
  };

  const appliedPromotions: StoreCartPromotion[] = cart.cart.promotions || [];

  return (
    <div className="space-y-4 rounded-lg bg-gray-50 p-4">
      <h3 className="font-semibold text-gray-900 text-lg">Promotional Codes</h3>

      {/* Add Promo Code */}
      <div className="flex flex-col space-y-2">
        <label
          htmlFor="promo-code"
          className="font-medium text-gray-700 text-sm"
        >
          Enter Promo Code
        </label>
        <div className="flex space-x-2">
          <input
            id="promo-code"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter promo code"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleAddPromotion}
            disabled={isLoading || !promoCode.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Apply"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Applied Promotions */}
      {appliedPromotions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 text-sm">
            Applied Promotions:
          </h4>
          <div className="space-y-2">
            {appliedPromotions.map((promotion) => (
              <div
                key={promotion.id}
                className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-green-800 text-sm">
                    {promotion.code}
                  </p>
                  {promotion.application_method && (
                    <p className="text-green-600 text-xs capitalize">
                      {promotion.application_method.type} discount of{" "}
                      {promotion.application_method.type === "fixed"
                        ? `${promotion.application_method.currency_code.toUpperCase()} ${promotion.application_method.value}`
                        : `${promotion.application_method.value}%`}
                    </p>
                  )}
                </div>
                <button
                  onClick={() =>
                    promotion.code && handleRemovePromotion(promotion.code)
                  }
                  disabled={isLoading}
                  className="ml-2 rounded bg-red-600 px-3 py-1 text-white text-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Promotions Message */}
      {appliedPromotions.length === 0 && (
        <div className="py-4 text-center">
          <p className="text-gray-500 text-sm">No promotional codes applied</p>
        </div>
      )}
    </div>
  );
}
