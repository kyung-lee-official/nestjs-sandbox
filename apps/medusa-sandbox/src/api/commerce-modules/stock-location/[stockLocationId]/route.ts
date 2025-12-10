import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { stockLocationId } = req.params;
  if (!stockLocationId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Missing stock location ID",
    );
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["*", "sales_channels.*"],
    filters: { id: stockLocationId },
  });

  return res.status(200).json(stockLocations[0]);
}
