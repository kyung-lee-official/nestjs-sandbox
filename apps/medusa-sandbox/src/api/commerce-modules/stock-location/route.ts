import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";
import { createStockLocationsWorkflow } from "@medusajs/medusa/core-flows";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const stockLocationService = req.scope.resolve(Modules.STOCK_LOCATION);
  const data = await stockLocationService.listStockLocations({
    // name: "USA Warehouse",
  });
  if (!data) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "No stock locations found",
    );
  }
  return res.status(200).json(data);
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { name } = req.body as any;

  const { result } = await createStockLocationsWorkflow(req.scope).run({
    input: {
      locations: [
        {
          name: name,
        },
      ],
    },
  });

  return res.status(200).json(result);
}
