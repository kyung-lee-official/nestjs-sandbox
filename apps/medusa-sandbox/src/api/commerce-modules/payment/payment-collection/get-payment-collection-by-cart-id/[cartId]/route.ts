import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { cartId } = req.params;
  if (!cartId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Cart ID is required",
    );
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: payment } = await query.graph({
    entity: "cart",
    fields: ["payment_collection.*"],
    filters: {
      id: cartId,
    },
  });
  return res.status(200).json(payment[0]);
}
