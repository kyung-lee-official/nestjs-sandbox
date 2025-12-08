import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
	ContainerRegistrationKeys,
	MedusaError,
} from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const { salesChannelId } = req.params;
	if (!salesChannelId) {
		throw new MedusaError(
			MedusaError.Types.INVALID_DATA,
			"Missing sales channel ID"
		);
	}

	const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
	const { data: salesChannels } = await query.graph({
		entity: "sales_channel",
		fields: ["stock_locations.*"],
		filters: { id: salesChannelId },
	});

	return res.status(200).json(salesChannels[0].stock_locations);
}
