import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { shippingOptionId } = req.params;
  if (!shippingOptionId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Shipping Option ID is required",
    );
  }

  try {
    /* Use Fulfillment Module to get shipping option */
    const fulfillmentModuleService = req.scope.resolve(Modules.FULFILLMENT);

    const shippingOption =
      await fulfillmentModuleService.retrieveShippingOption(shippingOptionId, {
        relations: ["type", "provider", "rules", "shipping_profile"],
      });

    if (!shippingOption) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Shipping option with ID ${shippingOptionId} not found`,
      );
    }

    return res.status(200).json(shippingOption);
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error;
    }

    console.error("Error retrieving shipping option:", error);
    throw new MedusaError(
      MedusaError.Types.DB_ERROR,
      "Failed to retrieve shipping option",
    );
  }
}
