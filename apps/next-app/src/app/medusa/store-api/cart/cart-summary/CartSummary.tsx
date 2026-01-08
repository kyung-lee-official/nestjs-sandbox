import type { StoreCart } from "@medusajs/types";

const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100); // Assuming amount is in cents
};

export const CartSummary = ({
  cart,
  onCheckout,
}: {
  cart: StoreCart;
  onCheckout: () => void;
}) => (
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
    <button
      onClick={onCheckout}
      className="mt-4 w-full rounded bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      disabled={!cart.shipping_address || !cart.shipping_methods?.length}
    >
      Proceed to Checkout
    </button>
    {(!cart.shipping_address || !cart.shipping_methods?.length) && (
      <p className="mt-2 text-center text-gray-500 text-sm">
        Please add shipping address and select shipping method
      </p>
    )}
  </div>
);