import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { paymentId } = req.params;

  const paymentModuleService = req.scope.resolve(Modules.PAYMENT);
  const payment = await paymentModuleService.retrievePayment(paymentId);

  return res.status(200).json(payment);
}
