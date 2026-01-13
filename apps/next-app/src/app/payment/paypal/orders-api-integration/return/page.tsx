import Link from "next/link";

type Props = {
  searchParams: Promise<{ token?: string; PayerID?: string }>;
};

const Page = async (props: Props) => {
  const searchParams = await props.searchParams;
  const orderId = searchParams.token;
  const payerId = searchParams.PayerID;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="mb-4 font-bold text-2xl text-gray-900">
          Payment Authorized Successfully!
        </h1>

        <p className="mb-6 text-gray-600">
          Thank you for your payment. Your transaction has been successfully
          authorized and is now being processed. You will receive a confirmation
          email shortly.
        </p>

        {/* Order Details */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
          <h3 className="mb-2 font-semibold text-gray-900">
            Transaction Details:
          </h3>
          <div className="space-y-1 text-gray-600 text-sm">
            <div>
              Status:{" "}
              <span className="font-medium text-green-600">Authorized</span>
            </div>
            <div>
              Payment Method: <span className="font-medium">PayPal</span>
            </div>
            {orderId && (
              <div>
                Order ID:{" "}
                <span className="font-medium font-mono text-xs">{orderId}</span>
              </div>
            )}
            {payerId && (
              <div>
                Payer ID:{" "}
                <span className="font-medium font-mono text-xs">{payerId}</span>
              </div>
            )}
            <div>
              Processing Time:{" "}
              <span className="font-medium">1-2 business days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {orderId && (
            <Link
              href={`/payment/paypal/orders-api-integration/order/${orderId}`}
              className="inline-block w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700"
            >
              View Order Details
            </Link>
          )}

          <Link
            href="/payment/paypal/orders-api-integration"
            className="inline-block w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Create Another Order
          </Link>

          <Link
            href="/"
            className="inline-block w-full rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-gray-500 text-xs">
          Need help? Contact our support team or check your PayPal account for
          transaction details.
        </p>
      </div>
    </div>
  );
};

export default Page;
