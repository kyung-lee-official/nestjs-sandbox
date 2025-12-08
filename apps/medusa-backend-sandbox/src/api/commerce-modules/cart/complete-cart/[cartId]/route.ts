import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { completeCartWorkflow } from "@medusajs/medusa/core-flows";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
	const { cartId } = req.params;

	if (!cartId) {
		return res.status(400).json({ error: "Cart ID is required" });
	}

	const { result } = await completeCartWorkflow(req.scope).run({
		input: {
			id: cartId,
		},
	});

	res.send(result);
}
