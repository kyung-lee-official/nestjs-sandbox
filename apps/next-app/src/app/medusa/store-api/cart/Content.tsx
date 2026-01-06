"use client";

import type { StoreCart } from "@medusajs/types";
import { useQuery } from "@tanstack/react-query";
import { useMIdStore } from "@/stores/medusa/medusa-entity-id";
import { createCart, getCart, QK_CART } from "./api";
import { CartAddresses } from "./cart-address/CartAddress";
import { LineItem } from "./LineItem";

const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100); // Assuming amount is in cents
};

const CartSummary = ({ cart }: { cart: StoreCart }) => (
  <div className="rounded-lg bg-gray-50 p-6">
    <h3 className="mb-4 font-semibold text-xl">Cart Summary</h3>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span className="font-medium">
          {formatCurrency(cart.subtotal, cart.currency_code)}
        </span>
      </div>
      {cart.tax_total > 0 && (
        <div className="flex justify-between">
          <span>Tax:</span>
          <span className="font-medium">
            {formatCurrency(cart.tax_total, cart.currency_code)}
          </span>
        </div>
      )}
      {cart.shipping_total > 0 && (
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span className="font-medium">
            {formatCurrency(cart.shipping_total, cart.currency_code)}
          </span>
        </div>
      )}
      {cart.discount_total > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount:</span>
          <span className="font-medium">
            -{formatCurrency(cart.discount_total, cart.currency_code)}
          </span>
        </div>
      )}
      <div className="flex justify-between border-t pt-2 font-bold text-lg">
        <span>Total:</span>
        <span>{formatCurrency(cart.total, cart.currency_code)}</span>
      </div>
    </div>
  </div>
);

const CartInfo = ({ cart }: { cart: StoreCart }) => (
  <div className="rounded-lg bg-blue-50 p-4">
    <h3 className="mb-3 font-semibold text-lg">Cart Information</h3>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="font-medium">Cart ID:</span>
        <p className="break-all font-mono text-xs">{cart.id}</p>
      </div>
      <div>
        <span className="font-medium">Currency:</span>
        <p>{cart.currency_code.toUpperCase()}</p>
      </div>
      {cart.email && (
        <div>
          <span className="font-medium">Email:</span>
          <p>{cart.email}</p>
        </div>
      )}
      {cart.region && (
        <div>
          <span className="font-medium">Region:</span>
          <p>{cart.region.name}</p>
        </div>
      )}
      <div>
        <span className="font-medium">Created:</span>
        <p>
          {cart.created_at
            ? new Date(cart.created_at).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
      <div>
        <span className="font-medium">Updated:</span>
        <p>
          {cart.updated_at
            ? new Date(cart.updated_at).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </div>
  </div>
);

const ShippingMethods = ({ cart }: { cart: StoreCart }) => (
  <div>
    <h3 className="mb-3 font-semibold text-lg">Shipping Methods</h3>
    {cart.shipping_methods && cart.shipping_methods.length > 0 ? (
      <div className="space-y-3">
        {cart.shipping_methods.map((method) => (
          <div key={method.id} className="rounded border p-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{method.name}</h4>
                {method.description && (
                  <p className="text-gray-600 text-sm">{method.description}</p>
                )}
              </div>
              <p className="font-medium">
                {formatCurrency(method.amount, cart.currency_code)}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No shipping methods selected</p>
    )}
  </div>
);

export const Content = () => {
  const hasHydrated = useMIdStore((state) => state.hasHydrated);
  const regionId = useMIdStore((state) => state.regionId);
  const cartId = useMIdStore((state) => state.cartId);
  const setCartId = useMIdStore((state) => state.setCartId);

  const cartQuery = useQuery({
    queryKey: [QK_CART.GET_CART, cartId, regionId],
    queryFn: async () => {
      let cart: StoreCart;
      if (!cartId) {
        if (!regionId) {
          throw new Error("Region ID is required to create a cart");
        }
        const cartRes = await createCart(regionId);
        cart = cartRes.cart;
      } else {
        const cartRes = await getCart(cartId);
        cart = cartRes.cart;
      }
      setCartId(cart.id);
      return cart;
    },
    enabled: hasHydrated && !!regionId,
  });

  if (!regionId) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h2 className="mb-2 font-semibold text-lg text-yellow-800">
            Region Required
          </h2>
          <p className="text-yellow-700">
            Please select a region on the region page to view cart information.
          </p>
        </div>
      </div>
    );
  }

  if (cartQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="h-64 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (cartQuery.isError) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 font-semibold text-lg text-red-800">
            Error Loading Cart
          </h2>
          <p className="text-red-700">
            {cartQuery.error instanceof Error
              ? cartQuery.error.message
              : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const cart = cartQuery.data;
  if (!cart) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-gray-500">No cart data available</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <details>
        <summary className="cursor-pointer text-gray-500 text-sm">
          Raw Cart Data (for debugging)
        </summary>
        <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs">
          {JSON.stringify(cart, null, 2)}
        </pre>
      </details>

      <div className="border-b pb-4">
        <h1 className="font-bold text-3xl">Shopping Cart</h1>
        <p className="mt-2 text-gray-600">
          Review your cart items and proceed to checkout
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <LineItem cart={cart} />
          <CartAddresses cart={cart} />
          <ShippingMethods cart={cart} />
        </div>

        <div className="space-y-6">
          <CartSummary cart={cart} />
          <CartInfo cart={cart} />
        </div>
      </div>

      {cart.promotions && cart.promotions.length > 0 && (
        <div>
          <h3 className="mb-3 font-semibold text-lg">Applied Promotions</h3>
          <div className="space-y-2">
            {cart.promotions.map((promotion, index) => (
              <div
                key={promotion.code || index}
                className="rounded border border-green-200 bg-green-50 p-3"
              >
                <p className="font-medium text-green-800">{promotion.code}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
