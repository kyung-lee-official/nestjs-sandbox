import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
	const { cartId } = req.params;

	if (!cartId) {
		return res.status(400).json({ error: "Cart ID is required" });
	}

	try {
		const cartModuleService = req.scope.resolve(Modules.CART);

		console.warn(`Force completing cart: ${cartId}`);

		const updatedCart = await cartModuleService.updateCarts(cartId, {
			completed_at: new Date(),
		});

		return res.status(200).json({
			success: true,
			cart: updatedCart,
			message: "Cart force-completed successfully",
			completed_at: updatedCart.completed_at,
		});
	} catch (error) {
		console.error("Error force completing cart:", error);

		return res.status(400).json({
			error: "Failed to force complete cart",
			details: error.message,
			cart_id: cartId,
		});
	}
}
