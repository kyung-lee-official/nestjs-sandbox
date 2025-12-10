import { MedusaError } from "@medusajs/framework/utils";

export async function GET() {
  throw new MedusaError(
    MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
    "payment authorization failed",
  );
}

const returnedError = {
  type: "payment_authorization_error",
  message: "payment authorization failed",
};
