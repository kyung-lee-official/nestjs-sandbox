import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const salesChannelService = req.scope.resolve(Modules.SALES_CHANNEL);
  const data = await salesChannelService.listSalesChannels();
  if (!data) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "No sales channels found",
    );
  }
  return res.status(200).json(data);
}
