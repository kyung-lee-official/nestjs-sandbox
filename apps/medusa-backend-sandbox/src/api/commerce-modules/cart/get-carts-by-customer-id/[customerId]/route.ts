import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError, Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const cartModuleService = req.scope.resolve(Modules.CART);
	const regionModuleService = req.scope.resolve(Modules.REGION);

	const { customerId } = req.params;
	const carts = await cartModuleService.listCarts({
		customer_id: customerId,
	});

	if (!carts || carts.length === 0) {
		throw new MedusaError(MedusaError.Types.NOT_FOUND, "No carts found");
	}

	/* get unique region IDs from carts */
	const regionIds = [
		...new Set(
			carts
				.map((cart) => cart.region_id)
				.filter((id): id is string => !!id)
		),
	];

	/* fetch regions by IDs (only if there are region IDs) */
	const regions =
		regionIds.length > 0
			? await regionModuleService.listRegions({ id: regionIds })
			: [];

	/* create a map for quick region lookup */
	const regionMap = regions.reduce((map, region) => {
		map[region.id] = region;
		return map;
	}, {});

	/* add region name to each cart */
	const cartsWithRegionNames = carts.map((cart) => ({
		...cart,
		region_name: cart.region_id ? regionMap[cart.region_id]?.name : null,
	}));

	/* non-completed carts only */
	const nonCompletedCarts = cartsWithRegionNames.filter(
		(cart) => !cart.completed_at
	);

	return res.status(200).json(nonCompletedCarts);
}
