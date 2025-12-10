import axios from "axios";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getPayPalBaseURL } from "../../utils";

export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/payment/paypal/v2/capture-order/[orderId]">,
) {
  try {
    const params = await ctx.params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("paypalAccessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "PayPal access token not found" },
        { status: 401 },
      );
    }

    /* Get environment-appropriate PayPal API base URL */
    const paypalBaseURL = getPayPalBaseURL();

    /* First, get the order details to check its status and intent */
    const orderResponse = await axios.get(
      `${paypalBaseURL}/v2/checkout/orders/${params.orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const order = orderResponse.data;

    /* For AUTHORIZE intent orders, we need to authorize first, then capture */
    if (order.intent === "AUTHORIZE" && order.status === "APPROVED") {
      /* Step 1: Authorize the payment */
      const authorizeResponse = await axios.post(
        `${paypalBaseURL}/v2/checkout/orders/${params.orderId}/authorize`,
        /* Empty body for authorize request */
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const authData = authorizeResponse.data;

      /* Step 2: Capture from the authorization */
      if (authData.purchase_units?.[0]?.payments?.authorizations?.[0]?.id) {
        const authId = authData.purchase_units[0].payments.authorizations[0].id;

        const captureResponse = await axios.post(
          `${paypalBaseURL}/v2/payments/authorizations/${authId}/capture`,
          /* Empty body for capture request */
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        return NextResponse.json(captureResponse.data);
      } else {
        return NextResponse.json(
          {
            error: "Authorization failed - no authorization ID found",
          },
          { status: 400 },
        );
      }
    } else if (order.intent === "CAPTURE") {
      /* For CAPTURE intent orders, direct capture */
      const response = await axios.post(
        `${paypalBaseURL}/v2/checkout/orders/${params.orderId}/capture`,
        /* Empty body for capture request */
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return NextResponse.json(response.data);
    } else {
      return NextResponse.json(
        {
          error: "Order cannot be captured",
          details: `Order status: ${order.status}, intent: ${order.intent}`,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error capturing PayPal order:", error);

    /* Handle axios errors specifically */
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: "Failed to capture order from PayPal",
          details: error.response?.data,
        },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
