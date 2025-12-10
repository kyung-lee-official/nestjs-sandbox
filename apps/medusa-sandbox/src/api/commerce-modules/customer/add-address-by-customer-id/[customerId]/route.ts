import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { createCustomerAddressesWorkflow } from "@medusajs/medusa/core-flows";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { customerId } = req.params;
  const addressData = req.body;

  const { result } = await createCustomerAddressesWorkflow(req.scope).run({
    input: {
      addresses: [{ customer_id: customerId, ...(addressData as any) }],
    },
  });

  res.send(result);
}
