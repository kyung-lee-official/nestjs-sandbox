import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { capturePaymentWorkflow } from "@medusajs/medusa/core-flows";
import { HttpError } from "@repo/types";
import axios, { AxiosError } from "axios";
import { getPayPalBaseURL } from "@/modules/paypal-payment/config";
import { paypalTokenManager } from "@/modules/paypal-payment/token-manager";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse,
  { params }: { params: { orderId: string } },
) {
  const { result } = await capturePaymentWorkflow(req.scope).run({
    input: {
      payment_id: params.orderId,
    },
  });

  res.status(200).send(result);

  return;

  //   try {
  //     /* Get access token from singleton token manager */
  //     const accessToken = await paypalTokenManager.getAccessToken();

  //     /* Get environment-appropriate PayPal API base URL */
  //     const paypalBaseURL = getPayPalBaseURL();

  //     /* First, get the order details to check its status and intent */
  //     const orderResponse = await axios.get(
  //       `${paypalBaseURL}/v2/checkout/orders/${params.orderId}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     );

  //     const order = orderResponse.data;

  //     /* For AUTHORIZE intent orders, we need to authorize first, then capture */
  //     if (order.intent === "AUTHORIZE" && order.status === "APPROVED") {
  //       /* Step 1: Authorize the payment */
  //       const authorizeResponse = await axios.post(
  //         `${paypalBaseURL}/v2/checkout/orders/${params.orderId}/authorize`,
  //         /* Empty body for authorize request */
  //         {},
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         },
  //       );

  //       const authData = authorizeResponse.data;

  //       /* Step 2: Capture from the authorization */
  //       if (authData.purchase_units?.[0]?.payments?.authorizations?.[0]?.id) {
  //         const authId = authData.purchase_units[0].payments.authorizations[0].id;

  //         const captureResponse = await axios.post(
  //           `${paypalBaseURL}/v2/payments/authorizations/${authId}/capture`,
  //           /* Empty body for capture request */
  //           {},
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${accessToken}`,
  //             },
  //           },
  //         );

  //         res.status(200).json(captureResponse.data);
  //         return;
  //       } else {
  //         throw new HttpError(
  //           "PAYMENT.PAYPAL_AUTHORIZATION_FAILED",
  //           "Authorization failed - no authorization ID found",
  //         );
  //       }
  //     } else if (order.intent === "CAPTURE") {
  //       /* For CAPTURE intent orders, direct capture */
  //       const response = await axios.post(
  //         `${paypalBaseURL}/v2/checkout/orders/${params.orderId}/capture`,
  //         /* Empty body for capture request */
  //         {},
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         },
  //       );

  //       res.status(200).json(response.data);
  //       return;
  //     } else {
  //       throw new HttpError(
  //         "PAYMENT.PAYPAL_ORDER_CANNOT_BE_CAPTURED",
  //         `Order cannot be captured. Status: ${order.status}, intent: ${order.intent}`,
  //       );
  //     }
  //   } catch (error: unknown) {
  //     /* Handle PayPal API errors */
  //     if (error instanceof AxiosError) {
  //       throw new HttpError(
  //         "PAYMENT.PAYPAL_ORDER_CANNOT_BE_CAPTURED",
  //         "PayPal API error occurred",
  //       );
  //     }
  //     throw new HttpError("SYSTEM.UNKNOWN_ERROR", "An unknown error occurred");
  //   }
}
