import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { stepOneStep } from "./steps/step-one";
import { stepThreeStep } from "./steps/step-three";
import { type StepTwoWorkflowInput, stepTwoStep } from "./steps/step-two";

export const testAtomicWorkflow = createWorkflow(
  "test-atomic-workflow",
  (input: StepTwoWorkflowInput) => {
    const stepOneResult = stepOneStep();
    const stepTwoResult = stepTwoStep(input);
    const stepThreeResult = stepThreeStep();

    return new WorkflowResponse({
      message: "Test Atomic Workflow Completed",
      data: {
        stepOne: stepOneResult,
        stepTwo: stepTwoResult,
        stepThree: stepThreeResult,
      },
    });
  },
);
