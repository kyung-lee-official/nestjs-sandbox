import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError } from "@medusajs/framework/utils";
import { listShippingOptionsForCartWithPricingWorkflow } from "@medusajs/medusa/core-flows";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { cartId } = req.params;
  if (!cartId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Cart ID is required",
    );
  }

  const { result } = await listShippingOptionsForCartWithPricingWorkflow(
    req.scope,
  ).run({
    input: {
      cart_id: cartId,
    },
  });

  res.send(result);
}
