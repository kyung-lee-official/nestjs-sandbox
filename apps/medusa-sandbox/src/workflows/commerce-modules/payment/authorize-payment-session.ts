import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { authorizePaymentSessionStep } from "@medusajs/medusa/core-flows";

type WorkflowInput = {
  id: string;
  context?: Record<string, any>;
};

export const authorizePaymentSessionsWorkflow = createWorkflow(
  "authorize-payment-session",
  (input: WorkflowInput) => {
    const data = authorizePaymentSessionStep({
      id: input.id,
      context: input.context,
    });
    return new WorkflowResponse(data);
  },
);
