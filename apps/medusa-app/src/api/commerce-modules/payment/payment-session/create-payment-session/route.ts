import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { createPaymentSessionsWorkflow } from "@medusajs/medusa/core-flows";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { payment_collection_id, provider_id } = req.body as any;

  const { result } = await createPaymentSessionsWorkflow(req.scope).run({
    input: {
      payment_collection_id,
      provider_id,
    },
  });

  return res.status(200).json(result);
}
