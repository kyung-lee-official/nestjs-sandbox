import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const inventoryService = req.scope.resolve(Modules.INVENTORY);
	const data = await inventoryService.listInventoryItems({});
	if (!data) {
		throw new MedusaError(
			MedusaError.Types.NOT_FOUND,
			"No inventory items found"
		);
	}
	return res.status(200).json(data);
}
