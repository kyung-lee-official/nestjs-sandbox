import Link from "next/link";
import { cookies } from "next/headers";
import { Content } from "./Content";

const Page = async () => {
	const cookieStore = await cookies();
	const paypalAccessToken = cookieStore.get("paypalAccessToken")?.value;
	return (
		<div className="flex flex-col p-4 gap-2">
			<h1>
				<Link
					href="https://docs.paypal.ai/developer/how-to/api/get-started"
					className="underline decoration-dotted cursor-pointer"
				>
					Docs: API
				</Link>
			</h1>
			<h1>
				<Link
					href="https://docs.paypal.ai/payments/methods/paypal/api/one-time/orders-api-integration"
					className="underline decoration-dotted cursor-pointer"
				>
					Official docs
				</Link>
			</h1>
			<Content paypalAccessToken={paypalAccessToken} />
		</div>
	);
};

export default Page;
