import axios from "axios";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { getPayPalBaseURL } from "../utils";
import { createOrderSchema } from "./schemas";

export async function POST(req: NextRequest) {
  try {
    /* Get access token from cookies */
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("paypalAccessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "PayPal access token not found. Please generate an access token first.",
        },
        { status: 401 },
      );
    }

    /* Get order data from request body */
    const rawOrderData = await req.json();

    /* Validate order data with Zod */
    const validationResult = createOrderSchema.safeParse(rawOrderData);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid order data",
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const orderData = validationResult.data;

    /* Call PayPal API to create order */
    const paypalBaseURL = getPayPalBaseURL();
    const paypalRes = await axios.post(
      `${paypalBaseURL}/v2/checkout/orders/`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(paypalRes.data);
  } catch (error: any) {
    console.error("Error creating PayPal order:", error);

    /* Handle PayPal API errors */
    if (error.response) {
      return NextResponse.json(
        {
          error: "PayPal API error",
          details: error.response.data,
          status: error.response.status,
        },
        { status: error.response.status },
      );
    }

    /* Handle other errors */
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 },
    );
  }
}
