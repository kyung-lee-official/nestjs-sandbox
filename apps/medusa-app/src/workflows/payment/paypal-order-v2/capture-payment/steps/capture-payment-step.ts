import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import type { IPaymentModuleService, PaymentDTO } from "@medusajs/types";
import { HttpError } from "@repo/types";

export type CapturePaymentStepInput = {
  paymentId: string;
};

export const capturePaymentStep = createStep(
  "capture-payment-step",
  async ({ paymentId }: CapturePaymentStepInput, { container }) => {
    if (!paymentId) {
      throw new HttpError("PAYMENT.PAYPAL_MISSING_PAYMENT_ID");
    }
    const paymentModuleService = container.resolve(
      Modules.PAYMENT,
    ) as IPaymentModuleService;

    const captureResult: PaymentDTO = await paymentModuleService.capturePayment(
      {
        payment_id: paymentId,
        amount: undefined,
        captured_by: undefined,
        is_captured: true,
      },
    );
    console.log(captureResult);

    return new StepResponse(captureResult);
  },
  async () => {
    console.log("Oops! Something went wrong in Capture Payment Step");
  },
);
