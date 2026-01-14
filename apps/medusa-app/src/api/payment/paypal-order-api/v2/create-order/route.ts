import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createOrderSchema, HttpError } from "@repo/types";
import axios, { AxiosError } from "axios";
import { getPayPalBaseURL } from "../utils/config";
import { paypalTokenManager } from "../utils/token-manager";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  /* Get order data from request body */
  const rawOrderData = await req.body;

  try {
    /* Get access token from singleton token manager */
    const accessToken = await paypalTokenManager.getAccessToken();

    /* Validate order data with Zod */
    const validationResult = createOrderSchema.safeParse(rawOrderData);

    if (!validationResult.success) {
      throw new HttpError(
        "PAYMENT.PAYPAL_INVALID_ORDER_DATA",
        "Invalid order data",
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

    res.status(200).json(paypalRes.data);
    return;
  } catch (error: unknown) {
    /* Handle PayPal API errors */
    if (error instanceof AxiosError) {
      throw new HttpError(
        "PAYMENT.PAYPAL_FAILED_TO_CREATE_ORDER",
        "PayPal API error occurred",
      );
    }
    throw new HttpError("SYSTEM.UNKNOWN_ERROR", "An unknown error occurred");
  }
}
