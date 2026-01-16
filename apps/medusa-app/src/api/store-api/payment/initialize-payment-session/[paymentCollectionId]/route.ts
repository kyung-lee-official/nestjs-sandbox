import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
  type CreatePaymentSessionsWorkflowInput,
  createPaymentSessionsWorkflow,
} from "@medusajs/medusa/core-flows";
import type { StoreInitializePaymentSession } from "@medusajs/types";
import type { IntentType } from "@repo/types";

type Data = {
  intent: IntentType;
  payment_collection_id: string;
};

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const paymentCollectionId = req.params.paymentCollectionId;
  const { provider_id, data } =
    (await req.body) as StoreInitializePaymentSession;
  const { result } = await createPaymentSessionsWorkflow(req.scope).run({
    input: {
      provider_id: provider_id,
      payment_collection_id: paymentCollectionId,
      data: data as Data,
    } as CreatePaymentSessionsWorkflowInput,
  });

  res.send(result);
  return;
}
