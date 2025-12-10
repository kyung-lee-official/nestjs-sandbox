import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import type { CreateTester } from "../../modules/tester/types";
import { createTesterStep } from "./steps/create-tester";

type WorkflowInput = {
  tester: CreateTester;
};

export const createTesterWorkflow = createWorkflow(
  "create-tester-workflow",
  (input: WorkflowInput) => {
    const tester = createTesterStep(input.tester);

    return new WorkflowResponse(tester);
  },
);
