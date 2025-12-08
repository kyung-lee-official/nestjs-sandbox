import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json({ error: "Missing user ID" });
	}

	const userModuleService = req.scope.resolve(Modules.USER);
	const authModuleService = req.scope.resolve(Modules.AUTH);
	const user = await userModuleService.retrieveUser(userId);
	if (!user) {
		throw new MedusaError(
			MedusaError.Types.NOT_FOUND,
			"User with the given ID does not exist"
		);
	}

	const providerIdentity = await authModuleService.listProviderIdentities({
		entity_id: user.email,
	});
	if (!providerIdentity.length) {
		throw new MedusaError(
			MedusaError.Types.NOT_FOUND,
			"User not found in provider identities"
		);
	}
	await authModuleService.deleteProviderIdentities([providerIdentity[0].id]);
	await authModuleService.deleteAuthIdentities([
		providerIdentity[0].auth_identity_id!,
	]);
	await userModuleService.deleteUsers([userId]);

	return res.status(204).send();
}
