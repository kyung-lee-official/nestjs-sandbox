import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  type CreatePaymentSessionsWorkflowInput,
  createPaymentSessionsWorkflow,
} from "@medusajs/medusa/core-flows";
import type { StoreInitializePaymentSession } from "@medusajs/types";
import { HttpError } from "@repo/types";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const paymentCollectionId = req.params.paymentCollectionId;
  const { provider_id, data } =
    (await req.body) as StoreInitializePaymentSession;
  if (!provider_id) {
    throw new HttpError(
      "PAYMENT.MISSING_PAYMENT_PROVIDER",
      "Payment provider ID is required",
    );
  }
  if (!data?.intent) {
    throw new HttpError(
      "PAYMENT.PAYPAL_MISSING_CONTEXT",
      "Payment intent is required in data",
    );
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: paymentCollections } = await query.graph({
    entity: "payment_collection",
    fields: ["id", "cart.id", "cart.shipping_address.*"],
    filters: {
      id: paymentCollectionId,
    },
  });

  const paymentCollection = paymentCollections[0];
  const cart = paymentCollection.cart;
  if (!cart) {
    throw new HttpError(
      "PAYMENT.PAYPAL_MISSING_CONTEXT",
      "Cart associated with the payment collection is required",
    );
  }
  const shippingAddress = cart.shipping_address;

  const { result } = await createPaymentSessionsWorkflow(req.scope).run({
    input: {
      provider_id: provider_id,
      payment_collection_id: paymentCollectionId,
      data: {
        intent: data.intent,
        payment_collection_id: paymentCollectionId,
        shipping_address: shippingAddress,
      },
    } as CreatePaymentSessionsWorkflowInput,
  });

  res.send(result);
  return;
}
