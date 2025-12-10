import { MedusaError } from "@medusajs/framework/utils";

export async function GET() {
  throw new MedusaError(MedusaError.Types.NOT_FOUND, "cannot find customer");
}

const returnedError = {
  type: "not_found",
  message: "cannot find customer",
};
