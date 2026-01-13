"use client";

import type { UseMutationResult } from "@tanstack/react-query";

type CartCreationProps = {
  cartId: string | null;
  regionId: string | null;
  onCreateCart: () => void;
  createCartMutation: UseMutationResult<any, Error, string, unknown>;
};

export const CartCreation = ({
  cartId,
  regionId,
  onCreateCart,
  createCartMutation,
}: CartCreationProps) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-semibold text-xl">Cart Management</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-sm">
            {cartId ? `Current Cart ID: ${cartId}` : "No cart available"}
          </p>
          <p className="mt-1 text-gray-600 text-xs">
            Create a new cart to start fresh or replace the current one
          </p>
        </div>
        <button
          onClick={onCreateCart}
          disabled={!regionId || createCartMutation.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {createCartMutation.isPending ? (
            <span className="flex items-center">
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Creating...
            </span>
          ) : (
            "Create New Cart"
          )}
        </button>
      </div>

      {createCartMutation.isError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-red-700 text-sm">
            Failed to create cart. Please try again.
          </p>
        </div>
      )}

      {createCartMutation.isSuccess && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-green-700 text-sm">
            Cart created successfully!
          </p>
        </div>
      )}
    </div>
  );
};