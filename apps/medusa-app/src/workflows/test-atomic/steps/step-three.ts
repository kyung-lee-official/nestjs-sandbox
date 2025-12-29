import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

export const stepThreeStep = createStep("step-three", async () => {
  console.log("Executing Step Three");
  return new StepResponse(`Hello from step three!`);
});
