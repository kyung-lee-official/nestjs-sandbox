import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { HttpError } from "@repo/types";

export type StepTwoWorkflowInput = {
  interrupt: boolean;
};

export const stepTwoStep = createStep(
  "step-two",
  async ({ interrupt }: StepTwoWorkflowInput) => {
    if (interrupt) {
      console.log("Failed at step two as requested.");
      throw new HttpError(
        "SYSTEM.UNKNOWN_ERROR",
        "An unknown error occurred in step two.",
      );
    }
    console.log("Executing Step Two");
    return new StepResponse(`Hello from step two!`);
  },
);
