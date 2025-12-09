import {
	createWorkflow,
	WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { createTesterStep } from "./steps/create-tester";
import { CreateTester } from "../../modules/tester/types";

type WorkflowInput = {
	tester: CreateTester;
};

export const createTesterWorkflow = createWorkflow(
	"create-tester-workflow",
	function (input: WorkflowInput) {
		const tester = createTesterStep(input.tester);

		return new WorkflowResponse(tester);
	}
);
