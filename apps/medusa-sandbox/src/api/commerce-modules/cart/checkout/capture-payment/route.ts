import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { capturePaymentWorkflow } from "@medusajs/medusa/core-flows";

interface CapturePaymentRequest {
  payment_id: string;
  amount?: number; // Optional: capture partial amount
}

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  const { payment_id, amount } = req.body as CapturePaymentRequest;

  // Step 4: Capture the payment (finalize the transaction)
  const { result } = await capturePaymentWorkflow(req.scope).run({
    input: {
      payment_id,
      captured_by: req.auth_context.auth_identity_id, // Optional: who captured
      amount, // Optional: if not provided, captures full amount
    },
  });

  return res.status(200).json({
    captured_payment: result,
  });
}
