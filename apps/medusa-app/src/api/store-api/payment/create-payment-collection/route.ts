import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { createPaymentCollectionForCartWorkflow } from "@medusajs/medusa/core-flows";
import type { CreatePaymentCollectionForCartWorkflowInputDTO } from "@medusajs/types";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  /* Get order data from request body */
  const input =
    (await req.body) as CreatePaymentCollectionForCartWorkflowInputDTO;
  const { result } = await createPaymentCollectionForCartWorkflow(
    req.scope,
  ).run({
    input: input,
  });

  res.send(result);
  return;
}
