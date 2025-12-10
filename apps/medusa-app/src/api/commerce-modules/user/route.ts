import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError, Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const userModuleService = req.scope.resolve(Modules.USER);

  const data = await userModuleService.listUsers();

  if (!data) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No users found");
  }
  return res.status(200).json(data);
}
