import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
	ContainerRegistrationKeys,
	MedusaError,
	Modules,
} from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const { customer_id, sales_channel_id, region_id } = req.query;
	if (!customer_id || !region_id) {
		throw new MedusaError(
			MedusaError.Types.INVALID_DATA,
			"customer_id and region_id are required"
		);
	}

	/* Use Cart Module Service with database-level filtering approach */
	const cartModuleService = req.scope.resolve(Modules.CART);

	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

	const { data: carts } = await query.graph({
		entity: "cart",
		fields: [
			"*",
			"items.*",
			"region.*",
			"customer.*",
			"sales_channel.*",
			"shipping_address.*",
			"shipping_methods.*",
		],
		filters: {
			customer_id: customer_id as string,
			sales_channel_id: sales_channel_id as string,
			region_id: region_id as string,
			/* Filter for active carts only */
			completed_at: null,
		},
	});

	/* TODO: Replace with database-level filtering when Medusa v2 API supports it:
	 * - Use proper query builder with WHERE completed_at IS NULL
	 * - Or use cart service with status filter if available
	 * - This will improve performance significantly for high-volume stores
	 */

	if (carts.length > 1) {
		throw new MedusaError(
			MedusaError.Types.INVALID_DATA,
			`Multiple active carts found for customer ${customer_id} in region ${region_id}`
		);
	}

	if (carts.length === 0) {
		/* No cart found, create one */
		const customerModuleService = req.scope.resolve(Modules.CUSTOMER);
		const customer = await customerModuleService.retrieveCustomer(
			customer_id as string
		);
		if (!customer) {
			throw new MedusaError(
				MedusaError.Types.NOT_FOUND,
				`Customer with id ${customer_id} not found`
			);
		}

		const salesChannelModuleService = req.scope.resolve(
			Modules.SALES_CHANNEL
		);
		const salesChannel =
			await salesChannelModuleService.retrieveSalesChannel(
				sales_channel_id as string
			);
		if (!salesChannel) {
			throw new MedusaError(
				MedusaError.Types.NOT_FOUND,
				`Sales Channel with id ${sales_channel_id} not found`
			);
		}

		const regionModuleService = req.scope.resolve(Modules.REGION);
		const region = await regionModuleService.retrieveRegion(
			region_id as string
		);
		if (!region) {
			throw new MedusaError(
				MedusaError.Types.NOT_FOUND,
				`Region with id ${region_id} not found`
			);
		}

		const cart = await cartModuleService.createCarts({
			currency_code: region.currency_code,
			email: customer.email,
			customer_id: customer_id as string,
			sales_channel_id: sales_channel_id as string,
			region_id: region_id as string,
		});
		return res.status(200).json(cart);
	}

	return res.status(200).json(carts[0]);
}
