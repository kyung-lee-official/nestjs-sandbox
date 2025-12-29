import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

export const stepOneStep = createStep("step-one", async () => {
  console.log("Executing Step One");
  return new StepResponse(`Hello from step one!`);
});
