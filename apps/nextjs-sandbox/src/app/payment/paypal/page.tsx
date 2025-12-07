import Link from "next/link";

const Page = () => {
	return (
		<div className="flex flex-col p-4 gap-2">
			<Link
				href="/payment/paypal/orders-api-integration"
				className="underline decoration-dotted cursor-pointer"
			>
				Integrate PayPal directly with the Orders v2 API
			</Link>
			<Link
				href="/payment/paypal/react-paypal-js"
				className="underline decoration-dotted cursor-pointer"
			>
				React PayPal JS
			</Link>
		</div>
	);
};

export default Page;
