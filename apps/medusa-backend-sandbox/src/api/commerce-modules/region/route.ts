import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const regionService = req.scope.resolve(Modules.REGION);
	const regions = await regionService.listRegions();

	return res.status(200).json(regions);
}
