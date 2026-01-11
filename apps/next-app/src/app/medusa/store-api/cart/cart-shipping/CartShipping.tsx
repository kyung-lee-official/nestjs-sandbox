import type { StoreCart } from "@medusajs/types";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/currency";
import { getShippingOptions } from "../../shipping-option/api";
import { updateCartShippingMethod } from "../api";

type ShippingOption = {
  id: string;
  name: string;
  amount: number;
  description?: string;
};

export const CartShipping = ({ cart }: { cart: StoreCart }) => {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showShippingSelector, setShowShippingSelector] = useState(false);

  useEffect(() => {
    const fetchShippingOptions = async () => {
      try {
        setIsLoading(true);
        // Check if cart has shipping address - required for shipping options
        if (!cart.shipping_address) {
          setShippingOptions([]);
          return;
        }

        const response = await getShippingOptions(cart.id);
        setShippingOptions(response.shipping_options || []);
      } catch (error) {
        console.error("Failed to fetch shipping options:", error);
        setShippingOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShippingOptions();
  }, [cart.shipping_address, cart.id]);

  const handleShippingMethodSelection = async (option: ShippingOption) => {
    try {
      await updateCartShippingMethod(cart.id, option.id);
      setShowShippingSelector(false);

      // You might want to trigger a cart refresh here
      window.location.reload(); // Simple approach - you might want to use a more sophisticated state management
    } catch (error) {
      console.error("Failed to update shipping method:", error);
    }
  };

  // Don't show selector if no shipping address
  if (!cart.shipping_address) {
    return (
      <div>
        <h3 className="mb-3 font-semibold text-lg">Shipping Methods</h3>
        <p className="text-gray-500">Please select a shipping address first</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-lg">Shipping Methods</h3>
        <button
          onClick={() => setShowShippingSelector(!showShippingSelector)}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
          disabled={isLoading || shippingOptions.length === 0}
        >
          {showShippingSelector ? "Cancel" : "Change"}
        </button>
      </div>

      {showShippingSelector ? (
        <div className="max-h-60 space-y-2 overflow-y-auto">
          {shippingOptions.map((option) => (
            <div
              key={option.id}
              className="cursor-pointer rounded border p-3 hover:bg-gray-50"
              onClick={() => handleShippingMethodSelection(option)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{option.name}</h4>
                  {option.description && (
                    <p className="text-gray-600 text-sm">
                      {option.description}
                    </p>
                  )}
                </div>
                <p className="font-medium">
                  {formatCurrency(option.amount, cart.currency_code)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : cart.shipping_methods && cart.shipping_methods.length > 0 ? (
        <div className="space-y-3">
          {cart.shipping_methods.map((method) => (
            <div key={method.id} className="rounded border p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{method.name}</h4>
                  {method.description && (
                    <p className="text-gray-600 text-sm">
                      {method.description}
                    </p>
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
};
