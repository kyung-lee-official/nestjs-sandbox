import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";
import type TesterModuleService from "@/modules/tester/service";
import { TESTER_MODULE } from "../../../modules/tester";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { testerId } = req.params;

  if (!testerId) {
    return res.status(400).json({ error: "Missing tester ID" });
  }

  const testerModuleService =
    req.scope.resolve<TesterModuleService>(TESTER_MODULE);
  const authModuleService = req.scope.resolve(Modules.AUTH);
  const tester = await testerModuleService.retrieveTester(testerId);
  if (!tester) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Tester with the given ID does not exist",
    );
  }

  const providerIdentity = await authModuleService.listProviderIdentities({
    entity_id: tester.email,
  });
  if (!providerIdentity.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Tester not found in provider identities",
    );
  }
  await authModuleService.deleteProviderIdentities([providerIdentity[0].id]);
  await authModuleService.deleteAuthIdentities([
    providerIdentity[0].auth_identity_id!,
  ]);
  await testerModuleService.deleteTesters(testerId);

  return res.status(204).send();
}
