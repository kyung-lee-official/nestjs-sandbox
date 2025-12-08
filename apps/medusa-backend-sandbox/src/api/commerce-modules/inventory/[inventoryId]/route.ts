import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
	ContainerRegistrationKeys,
	MedusaError,
} from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const { inventoryId } = req.params;
	if (!inventoryId) {
		throw new MedusaError(
			MedusaError.Types.INVALID_DATA,
			"Missing inventory ID"
		);
	}

	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
	const { data: inventoryItems } = await query.graph({
		entity: "inventory_item",
		fields: [
			/* Basic inventory item fields */
			"*",
			"variants.*",
		],
		filters: { id: inventoryId },
	});
	if (!inventoryItems || inventoryItems.length === 0) {
		throw new MedusaError(
			MedusaError.Types.NOT_FOUND,
			`Inventory item with ID ${inventoryId} not found`
		);
	}

	const { data: inventoryLevels } = await query.graph({
		entity: "inventory_level",
		fields: ["*"],
		filters: { inventory_item_id: inventoryId },
	});
	if (!inventoryLevels || inventoryLevels.length === 0) {
		throw new MedusaError(
			MedusaError.Types.NOT_FOUND,
			`Inventory level for item ID ${inventoryId} not found`
		);
	}

	/* Get unique location IDs from inventory levels */
	const locationIds = [
		...new Set(
			inventoryLevels
				.map((level: any) => level.location_id)
				.filter(Boolean)
		),
	];

	/* Fetch stock locations for all location IDs */
	let stockLocations: any[] = [];
	if (locationIds.length > 0) {
		const { data: locations } = await query.graph({
			entity: "stock_location",
			fields: ["*", "address.*"],
			filters: { id: locationIds },
		});
		stockLocations = locations || [];
	}

	/* Create a map for quick location lookup */
	const locationMap = stockLocations.reduce((map: any, location: any) => {
		map[location.id] = location;
		return map;
	}, {});

	/* Enrich inventory levels with stock location data */
	const enrichedInventoryLevels = inventoryLevels.map((level: any) => ({
		...level,
		stock_location: level.location_id
			? locationMap[level.location_id]
			: null,
	}));

	const inventoryItem = inventoryItems[0] as any;

	/* Calculate additional computed fields */
	const enrichedInventory = {
		...inventoryItem,
		inventory_levels: enrichedInventoryLevels,
	};

	return res.status(200).json(enrichedInventory);
}
