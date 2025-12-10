import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { addShippingMethodToCartWorkflow } from "@medusajs/medusa/core-flows";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { cartId } = req.params;
  const { shippingOptionId } = req.body as { shippingOptionId: string };

  if (!cartId || !shippingOptionId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Both cartId and shippingOptionId are required",
    );
  }

  try {
    /* Use req.scope (Medusa container) instead of scope from body */
    const { result } = await addShippingMethodToCartWorkflow(req.scope).run({
      input: {
        cart_id: cartId,
        options: [{ id: shippingOptionId }],
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error adding shipping method:", error);
    throw new MedusaError(
      MedusaError.Types.DB_ERROR,
      "Failed to add shipping method to cart",
    );
  }
}
