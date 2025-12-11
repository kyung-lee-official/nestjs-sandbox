import Link from "next/link";
import { ShippingAddress } from "./ShippingAddress";
import { ShippingMethod } from "./ShippingMethod";

type CartBasicInfoProps = {
  cart: any;
  customerAddresses: any[];
  regionId: string;
  salesChannelId: string;
  customerId: string;
};

export const CartBasicInfo = (props: CartBasicInfoProps) => {
  const { cart, customerAddresses, regionId, salesChannelId, customerId } =
    props;
  return (
    <div className="my-4 rounded border bg-neutral-100 p-4">
      <div>
        <strong>Cart ID:</strong>{" "}
        <Link
          href={`/medusa/commerce-modules/cart/${cart.id}`}
          className="cursor-pointer underline decoration-dotted"
        >
          {cart.id}
        </Link>
      </div>
      <div>
        <strong>Region:</strong> {cart.region.name}
      </div>
      <div>
        <strong>Currency:</strong> {cart.currency_code}
      </div>
      <div>
        <strong>Shipping Address:</strong>{" "}
        <ShippingAddress
          cartId={cart.id}
          customerAddresses={customerAddresses}
          regionId={regionId}
          salesChannelId={salesChannelId}
          customerId={customerId}
        />
      </div>
      <div>
        <strong>Shipping Method:</strong>{" "}
        <ShippingMethod
          cartId={cart.id}
          regionId={regionId}
          salesChannelId={salesChannelId}
          customerId={customerId}
        />
      </div>
    </div>
  );
};
