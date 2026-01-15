import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { capturePaymentStep } from "./steps/capture-payment-step";

type CapturePaymentWorkflowInput = {
  paymentId: string;
};

export const capturePaymentWorkflow = createWorkflow(
  "paypal-order-v2-capture-payment-workflow",
  (input: CapturePaymentWorkflowInput) => {
    const capturePaymentStepResult = capturePaymentStep({
      paymentId: input.paymentId,
    });

    const result = transform(
      {
        capturePaymentStepResult,
      },
      (input) => {
        return {
          message: "PayPal Order V2 Capture Payment Workflow Completed",
          data: {
            capturePayment: input.capturePaymentStepResult,
          },
        };
      },
    );

    return new WorkflowResponse(result);
  },
);
