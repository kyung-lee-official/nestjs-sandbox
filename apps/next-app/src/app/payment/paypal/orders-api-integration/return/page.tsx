import Link from "next/link";

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Authorized Successfully!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your transaction has been successfully
          authorized and is now being processed. You will receive a confirmation
          email shortly.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">
            Transaction Details:
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>
              Status:{" "}
              <span className="font-medium text-green-600">Authorized</span>
            </div>
            <div>
              Payment Method: <span className="font-medium">PayPal</span>
            </div>
            <div>
              Processing Time:{" "}
              <span className="font-medium">1-2 business days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/payment/paypal/orders-api-integration"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
          >
            Create Another Order
          </Link>

          <Link
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium inline-block"
          >
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-6">
          Need help? Contact our support team or check your PayPal account for
          transaction details.
        </p>
      </div>
    </div>
  );
};

export default Page;
