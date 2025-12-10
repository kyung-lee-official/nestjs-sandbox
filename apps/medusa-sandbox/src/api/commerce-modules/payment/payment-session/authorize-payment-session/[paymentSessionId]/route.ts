import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils";
import { completeCartWorkflow } from "@medusajs/medusa/core-flows";
import { authorizePaymentSessionsWorkflow } from "../../../../../../workflows/commerce-modules/payment/authorize-payment-session";

type AuthorizePaymentBody = {
  /* additional payment data (card details, etc.) */
  context?: Record<string, any>;
};

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { paymentSessionId } = req.params;
  const { context = {} } = req.body as AuthorizePaymentBody;

  if (!paymentSessionId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Payment session ID is required",
    );
  }

  try {
    /* Step 1: Get payment session to find payment collection */
    const paymentModuleService = req.scope.resolve(Modules.PAYMENT);
    const paymentSession = await paymentModuleService.retrievePaymentSession(
      paymentSessionId,
      {
        relations: ["payment_collection"],
      },
    );

    if (!paymentSession?.payment_collection_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Payment collection not found for this payment session",
      );
    }

    /* Step 2: Get payment collection details */
    const paymentCollection =
      await paymentModuleService.retrievePaymentCollection(
        paymentSession.payment_collection_id,
      );

    /* Step 3: Find cart ID from payment session context or payment collection metadata */
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { data: paymentCollections } = await query.graph({
      entity: "payment_collection",
      fields: ["cart.*", "cart.region.*", "cart.sales_channel.*"],
      filters: {
        id: paymentCollection.id,
      },
    });

    /* Verify cart exists */
    if (!paymentCollections[0].cart) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Cart not found for this payment collection",
      );
    }
    const cartId = paymentCollections[0].cart.id;

    /* Step 4: Authorize payment session */
    const { result: authorizeResult } = await authorizePaymentSessionsWorkflow(
      req.scope,
    ).run({
      input: {
        id: paymentSessionId,
        context,
      },
    });

    /* Step 5: Complete Cart (create order) */
    const { result: completeCartResult } = await completeCartWorkflow(
      req.scope,
    ).run({
      input: {
        id: cartId,
      },
    });

    return res.status(200).json({
      success: true,
      payment_authorization: authorizeResult,
      order: completeCartResult /* This is now the created order */,
      cart_id: cartId,
      payment_collection_id: paymentCollection.id,
      payment_session_id: paymentSessionId,
      message:
        "Payment authorized and cart completed successfully - Order created!",
    });
  } catch (error) {
    console.error("Error in authorize payment session:", error);

    if (error instanceof MedusaError) {
      throw error;
    }

    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Failed to authorize payment and complete cart: ${error.message}`,
    );
  }
}
