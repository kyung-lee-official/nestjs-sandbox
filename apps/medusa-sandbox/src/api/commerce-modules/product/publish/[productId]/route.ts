import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
	const { productId } = req.params;

	if (!productId) {
		return res.status(400).json({ error: "Missing product ID" });
	}

	const productModuleService = req.scope.resolve(Modules.PRODUCT);
	const product = await productModuleService.retrieveProduct(productId);
	if (!product) {
		throw new MedusaError(
			MedusaError.Types.NOT_FOUND,
			"Product with the given ID does not exist"
		);
	}

	await updateProductsWorkflow(req.scope).run({
		input: {
			products: [{ id: productId, status: "published" }],
		},
	});

	return res.status(200).json({ message: "Product published successfully" });
}
