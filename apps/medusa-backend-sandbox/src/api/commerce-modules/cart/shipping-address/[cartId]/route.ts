import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
	const { cartId } = req.params;
	const { address_id } = req.body as any;

	const customerModuleService = req.scope.resolve(Modules.CUSTOMER);
	const customerAddresses = await customerModuleService.listCustomerAddresses(
		{
			id: address_id,
		}
	);
	if (!customerAddresses || customerAddresses.length === 0) {
		throw new MedusaError(
			MedusaError.Types.NOT_FOUND,
			"Address with the given ID does not exist"
		);
	}
	const address = customerAddresses[0];
	const cartModuleService = req.scope.resolve(Modules.CART);
	const result = await cartModuleService.updateCarts(cartId, {
		shipping_address: {
			first_name: address.first_name,
			last_name: address.last_name,
			address_1: address.address_1,
			city: address.city,
			country_code: address.country_code,
			postal_code: address.postal_code,
			metadata: {
				customer_address_id: address.id,
			},
		},
	});

	res.send(result);
}
