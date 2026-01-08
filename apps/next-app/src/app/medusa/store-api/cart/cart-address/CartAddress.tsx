import type { StoreCart, StoreCustomerAddress } from "@medusajs/types";
import { useEffect, useState } from "react";
import { getMyAddresses } from "../../customer/api";
import { updateACart } from "../api";

export const CartAddresses = ({ cart }: { cart: StoreCart }) => {
  const [customerAddresses, setCustomerAddresses] = useState<
    StoreCustomerAddress[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showShippingSelector, setShowShippingSelector] = useState(false);
  const [showBillingSelector, setShowBillingSelector] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const { addresses } = await getMyAddresses();

        setCustomerAddresses(addresses || []);
      } catch (error) {
        console.error("Failed to fetch customer addresses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressSelection = async (
    address: StoreCustomerAddress,
    type: "shipping" | "billing",
  ) => {
    try {
      const updates = {
        [type === "shipping" ? "shipping_address" : "billing_address"]: {
          first_name: address.first_name,
          last_name: address.last_name,
          company: address.company,
          address_1: address.address_1,
          address_2: address.address_2,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,
          country_code: address.country_code,
          phone: address.phone,
        },
      };

      await updateACart(cart.id, updates);

      if (type === "shipping") {
        setShowShippingSelector(false);
      } else {
        setShowBillingSelector(false);
      }

      // You might want to trigger a cart refresh here
      window.location.reload(); // Simple approach - you might want to use a more sophisticated state management
    } catch (error) {
      console.error(`Failed to update ${type} address:`, error);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Shipping Address</h3>
          <button
            onClick={() => setShowShippingSelector(!showShippingSelector)}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading || customerAddresses.length === 0}
          >
            {showShippingSelector ? "Cancel" : "Change"}
          </button>
        </div>

        {showShippingSelector ? (
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {customerAddresses.map((address) => (
              <div
                key={address.id}
                className="cursor-pointer rounded border p-3 hover:bg-gray-50"
                onClick={() => handleAddressSelection(address, "shipping")}
              >
                <div className="text-sm">
                  <p className="font-medium">
                    {address.first_name} {address.last_name}
                  </p>
                  {address.company && <p>{address.company}</p>}
                  <p>{address.address_1}</p>
                  {address.address_2 && <p>{address.address_2}</p>}
                  <p>
                    {address.city}, {address.province} {address.postal_code}
                  </p>
                  <p>{address.country_code?.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : cart.shipping_address ? (
          <div className="space-y-1 text-sm">
            {cart.shipping_address.first_name && (
              <p>
                {cart.shipping_address.first_name}{" "}
                {cart.shipping_address.last_name}
              </p>
            )}
            {cart.shipping_address.company && (
              <p>{cart.shipping_address.company}</p>
            )}
            {cart.shipping_address.address_1 && (
              <p>{cart.shipping_address.address_1}</p>
            )}
            {cart.shipping_address.address_2 && (
              <p>{cart.shipping_address.address_2}</p>
            )}
            <p>
              {cart.shipping_address.city && `${cart.shipping_address.city}, `}
              {cart.shipping_address.province}{" "}
              {cart.shipping_address.postal_code}
            </p>
            {cart.shipping_address.country_code && (
              <p>{cart.shipping_address.country_code.toUpperCase()}</p>
            )}
            {cart.shipping_address.phone && (
              <p>Phone: {cart.shipping_address.phone}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No shipping address set</p>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Billing Address</h3>
          <button
            onClick={() => setShowBillingSelector(!showBillingSelector)}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading || customerAddresses.length === 0}
          >
            {showBillingSelector ? "Cancel" : "Change"}
          </button>
        </div>

        {showBillingSelector ? (
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {customerAddresses.map((address) => (
              <div
                key={address.id}
                className="cursor-pointer rounded border p-3 hover:bg-gray-50"
                onClick={() => handleAddressSelection(address, "billing")}
              >
                <div className="text-sm">
                  <p className="font-medium">
                    {address.first_name} {address.last_name}
                  </p>
                  {address.company && <p>{address.company}</p>}
                  <p>{address.address_1}</p>
                  {address.address_2 && <p>{address.address_2}</p>}
                  <p>
                    {address.city}, {address.province} {address.postal_code}
                  </p>
                  <p>{address.country_code?.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : cart.billing_address ? (
          <div className="space-y-1 text-sm">
            {cart.billing_address.first_name && (
              <p>
                {cart.billing_address.first_name}{" "}
                {cart.billing_address.last_name}
              </p>
            )}
            {cart.billing_address.company && (
              <p>{cart.billing_address.company}</p>
            )}
            {cart.billing_address.address_1 && (
              <p>{cart.billing_address.address_1}</p>
            )}
            {cart.billing_address.address_2 && (
              <p>{cart.billing_address.address_2}</p>
            )}
            <p>
              {cart.billing_address.city && `${cart.billing_address.city}, `}
              {cart.billing_address.province} {cart.billing_address.postal_code}
            </p>
            {cart.billing_address.country_code && (
              <p>{cart.billing_address.country_code.toUpperCase()}</p>
            )}
            {cart.billing_address.phone && (
              <p>Phone: {cart.billing_address.phone}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No billing address set</p>
        )}
      </div>
    </div>
  );
};
