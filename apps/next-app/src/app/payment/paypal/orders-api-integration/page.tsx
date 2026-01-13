import { cookies } from "next/headers";
import Link from "next/link";
import { Content } from "./Content";

const Page = async () => {
  const cookieStore = await cookies();
  const paypalAccessToken = cookieStore.get("paypalAccessToken")?.value;

  if (!paypalAccessToken) {
    return (
      <div className="p-4">
        <p className="text-red-600">
          PayPal access token not found. Please generate an access token first.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <h1>
        <Link
          href="https://docs.paypal.ai/developer/how-to/api/get-started"
          className="cursor-pointer underline decoration-dotted"
        >
          Docs: API
        </Link>
      </h1>
      <h1>
        <Link
          href="https://docs.paypal.ai/payments/methods/paypal/api/one-time/orders-api-integration"
          className="cursor-pointer underline decoration-dotted"
        >
          Official docs
        </Link>
      </h1>
      <Content paypalAccessToken={paypalAccessToken} />
    </div>
  );
};

export default Page;
