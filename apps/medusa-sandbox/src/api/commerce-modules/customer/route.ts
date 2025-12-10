import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError, Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerModuleService = req.scope.resolve(Modules.CUSTOMER);

  const data = await customerModuleService.listCustomers();

  if (!data) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No customers found");
  }
  return res.status(200).json(data);
}
