import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";
import { deleteCustomerAddressesWorkflow } from "@medusajs/medusa/core-flows";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
	const { addressId } = req.params;

	if (!addressId) {
		throw new MedusaError(
			MedusaError.Types.INVALID_DATA,
			"Address ID is required"
		);
	}

	try {
		/* Delete address using workflow - let the workflow handle validation */
		const { result } = await deleteCustomerAddressesWorkflow(req.scope).run(
			{
				input: {
					ids: [addressId],
				},
			}
		);

		return res.status(200).json({
			success: true,
			deleted_address_id: addressId,
			message: "Address deleted successfully",
			result,
		});
	} catch (error) {
		if (error instanceof MedusaError) {
			throw error;
		}

		console.error("Error deleting address:", error);
		throw new MedusaError(
			MedusaError.Types.DB_ERROR,
			`Failed to delete address: ${error.message}`
		);
	}
}
