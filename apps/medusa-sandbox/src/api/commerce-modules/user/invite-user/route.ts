import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { inviteSchema } from "./validation-schemas";
import { createInvitesWorkflow } from "@medusajs/medusa/core-flows";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
	const validatedBody = inviteSchema.parse(req.body);

	if (!validatedBody) {
		return MedusaError.Types.INVALID_DATA;
	}
	const { result } = await createInvitesWorkflow(req.scope).run({
		input: {
			invites: [validatedBody],
		},
	});
	res.send(result);
}
