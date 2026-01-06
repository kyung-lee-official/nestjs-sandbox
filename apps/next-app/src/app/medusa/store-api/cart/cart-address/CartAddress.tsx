import type { StoreCart } from "@medusajs/types";

export const CartAddresses = ({ cart }: { cart: StoreCart }) => (
  <div className="grid gap-6 md:grid-cols-2">
    <div>
      <h3 className="mb-3 font-semibold text-lg">Shipping Address</h3>
      {cart.shipping_address ? (
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
            {cart.shipping_address.province} {cart.shipping_address.postal_code}
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
      <h3 className="mb-3 font-semibold text-lg">Billing Address</h3>
      {cart.billing_address ? (
        <div className="space-y-1 text-sm">
          {cart.billing_address.first_name && (
            <p>
              {cart.billing_address.first_name} {cart.billing_address.last_name}
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
