import type { StoreCart } from "@medusajs/types";

export const CartInfo = ({ cart }: { cart: StoreCart }) => (
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
