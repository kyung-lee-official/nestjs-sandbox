import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError, Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { paymentCollectionId } = req.params;

  if (!paymentCollectionId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Payment collection ID is required",
    );
  }

  try {
    /* resolve the Payment Module service */
    const paymentModuleService = req.scope.resolve(Modules.PAYMENT);

    /* retrieve payment collection with related data */
    const paymentCollection =
      await paymentModuleService.retrievePaymentCollection(
        paymentCollectionId,
        {
          relations: ["payment_sessions", "payments"],
        },
      );

    if (!paymentCollection) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payment collection with ID ${paymentCollectionId} not found`,
      );
    }

    return res.status(200).json({
      payment_collection: paymentCollection,
    });
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error;
    }
    /* handle other errors (like database errors) */
    console.error("Error retrieving payment collection:", error);
    throw new MedusaError(
      MedusaError.Types.DB_ERROR,
      "Failed to retrieve payment collection",
    );
  }
}
