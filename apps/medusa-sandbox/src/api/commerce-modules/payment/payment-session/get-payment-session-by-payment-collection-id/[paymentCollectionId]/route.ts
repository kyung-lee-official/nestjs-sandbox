import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { paymentCollectionId } = req.params;
  const paymentModuleService = req.scope.resolve(Modules.PAYMENT);
  const results = await paymentModuleService.listPaymentSessions({
    payment_collection_id: paymentCollectionId,
  });

  return res.status(200).json(results[0]);
}
