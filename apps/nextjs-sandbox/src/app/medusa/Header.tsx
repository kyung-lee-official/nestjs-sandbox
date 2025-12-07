import { Customer } from "./commerce-modules/customer/Customer";
import { Region } from "./commerce-modules/region/Region";
import { Cart } from "./commerce-modules/cart/cart-modal/Cart";
import { SalesChannel } from "./commerce-modules/sales-channel/SalesChannel";
import Link from "next/link";

type HeaderProps = {
	regionId: string | undefined;
	salesChannelId: string | undefined;
	customerId: string | undefined;
};

export const Header = (props: HeaderProps) => {
	const { regionId, salesChannelId, customerId } = props;

	return (
		<div
			className="flex justify-between items-center h-14 px-4
			border-b border-dashed border-neutral-700"
		>
			<div className="flex items-center w-3/5 gap-2">
				<Link
					href="/medusa"
					className="underline decoration-dotted text-nowrap"
				>
					Medusa Home
				</Link>
				<Region regionId={regionId} />
				<SalesChannel salesChannelId={salesChannelId} />
				<Customer customerId={customerId} />
			</div>
			<Cart
				regionId={regionId}
				salesChannelId={salesChannelId}
				customerId={customerId}
			/>
		</div>
	);
};
