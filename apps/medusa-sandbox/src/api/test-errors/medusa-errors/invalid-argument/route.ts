import { MedusaError } from "@medusajs/framework/utils";

export async function GET() {
  throw new MedusaError(
    MedusaError.Types.INVALID_ARGUMENT,
    "invalid data provided",
  );
}

const returnedError = {
  type: "invalid_argument",
  message: "invalid data provided",
};
