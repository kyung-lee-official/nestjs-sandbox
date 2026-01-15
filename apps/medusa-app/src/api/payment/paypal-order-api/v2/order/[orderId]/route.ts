import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { HttpError } from "@repo/types";
import axios, { AxiosError } from "axios";
import { getPayPalBaseURL } from "@/modules/paypal-payment/config";
import { paypalTokenManager } from "@/modules/paypal-payment/token-manager";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
  { params }: { params: { orderId: string } },
) {
  try {
    /* Get access token from singleton token manager */
    const accessToken = await paypalTokenManager.getAccessToken();

    /* Fetch order details from PayPal API */
    const paypalBaseURL = getPayPalBaseURL();
    const response = await axios.get(
      `${paypalBaseURL}/v2/checkout/orders/${params.orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    res.status(200).json(response.data);
    return;
  } catch (error: unknown) {
    /* Handle PayPal API errors */
    if (error instanceof AxiosError) {
      throw new HttpError(
        "PAYMENT.PAYPAL_FAILED_TO_FETCH_ORDER",
        "PayPal API error occurred",
      );
    }
    throw new HttpError("SYSTEM.UNKNOWN_ERROR", "An unknown error occurred");
  }
}
