import { MedusaError } from "@medusajs/framework/utils";

export async function GET() {
  throw new MedusaError(
    MedusaError.Types.DUPLICATE_ERROR,
    "email already exists",
  );
}

const returnedError = {
  code: "invalid_request_error",
  type: "duplicate_error",
  message: "email already exists",
};
