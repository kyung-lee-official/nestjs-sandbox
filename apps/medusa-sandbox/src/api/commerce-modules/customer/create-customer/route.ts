import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { MedusaError, Modules } from "@medusajs/framework/utils";
import {
  createCartWorkflow,
  createCustomerAccountWorkflow,
} from "@medusajs/medusa/core-flows";
import { createSchema } from "./validation-schemas";

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const validatedBody = createSchema.parse(req.body);
  if (!validatedBody) {
    return MedusaError.Types.INVALID_DATA;
  }
  const { email, first_name, last_name } = validatedBody;

  const auth_identity_id = req.auth_context?.auth_identity_id;
  if (!auth_identity_id) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Unauthorized");
  }

  const { result } = await createCustomerAccountWorkflow(req.scope).run({
    input: {
      authIdentityId: auth_identity_id,
      customerData: {
        email: email,
        first_name: first_name,
        last_name: last_name,
      },
    },
  });
  const regionModuleService = req.scope.resolve(Modules.REGION);
  const found = await regionModuleService.listRegions({
    name: "United States",
  });
  if (!found.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Region with the given name does not exist",
    );
  }
  const defaultRegion = found[0];

  /**
   * create a default cart for the customer
   *
   * Note: cart is not reusable after an order is created from it.
   * That being said, a customer doesn't necessarily need a cart,
   * you can create it whenever it's needed.
   */
  await createCartWorkflow(req.scope).run({
    input: {
      customer_id: result.id,
      email: email,
      region_id: defaultRegion.id,
      currency_code: defaultRegion.currency_code,
    },
  });
  res.send(result);
}
