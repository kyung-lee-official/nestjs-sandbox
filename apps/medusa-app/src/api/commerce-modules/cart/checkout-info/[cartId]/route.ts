import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { getCartDetailsWorkflow } from "../../../../../workflows/commerce-modules/cart/get-cart-details";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { cartId } = req.params;
  const { result } = await getCartDetailsWorkflow(req.scope).run({
    input: {
      cart_id: cartId,
    },
  });

  return res.status(200).json(result);
}
