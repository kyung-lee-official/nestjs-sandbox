import { createWorkflow } from "@medusajs/framework/workflows-sdk";
import { testNotificationStep } from "./steps/test-notification";

export const testNotificationWorkflow = createWorkflow(
  "test-notification-workflow",
  () => {
    testNotificationStep();
  },
);
