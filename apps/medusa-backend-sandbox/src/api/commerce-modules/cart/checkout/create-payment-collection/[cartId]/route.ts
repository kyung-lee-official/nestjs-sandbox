import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createPaymentCollectionForCartWorkflow } from "@medusajs/medusa/core-flows";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
	const { cartId } = req.params;

	const { result: paymentCollection } =
		await createPaymentCollectionForCartWorkflow(req.scope).run({
			input: {
				cart_id: cartId,
			},
		});

	return res.status(200).json({
		completed_cart: paymentCollection,
	});
}
