import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { customerId } = req.params;

  const customerModuleService = req.scope.resolve(Modules.CUSTOMER);
  const customer = await customerModuleService.retrieveCustomer(customerId, {
    relations: ["addresses"],
  });

  return res.status(200).json(customer);
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { customerId } = req.params;

  if (!customerId) {
    return res.status(400).json({ error: "Missing customer ID" });
  }

  const customerModuleService = req.scope.resolve(Modules.CUSTOMER);
  const authModuleService = req.scope.resolve(Modules.AUTH);
  const cartModuleService = req.scope.resolve(Modules.CART);

  const customer = await customerModuleService.retrieveCustomer(customerId);
  if (!customer) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Customer with the given ID does not exist",
    );
  }

  const providerIdentity = await authModuleService.listProviderIdentities({
    entity_id: customer.email,
  });
  if (!providerIdentity.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Customer not found in provider identities",
    );
  }
  await authModuleService.deleteProviderIdentities([providerIdentity[0].id]);
  await authModuleService.deleteAuthIdentities([
    providerIdentity[0].auth_identity_id!,
  ]);
  /* this marks the customer as deleted in the DB, but does not remove the record */
  // await deleteCustomersWorkflow(req.scope).run({
  // 	input: {
  // 		ids: [customerId],
  // 	},
  // });
  await customerModuleService.deleteCustomers([customerId]);
  const carts = await cartModuleService.listCarts({
    customer_id: customerId,
  });
  await cartModuleService.deleteCarts(carts.map((cart) => cart.id));

  return res.status(204).send();
}
