import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { createUserAccountWorkflow } from "@medusajs/medusa/core-flows";
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

  const { result } = await createUserAccountWorkflow(req.scope).run({
    input: {
      authIdentityId: auth_identity_id,
      userData: {
        email: email,
        first_name: first_name,
        last_name: last_name,
      },
    },
  });
  res.send(result);
}
