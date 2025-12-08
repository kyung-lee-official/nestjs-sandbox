import { createWorkflow } from "@medusajs/framework/workflows-sdk";
import { createTestSubscriberStep } from "./steps/test-subscriber";

export type WorkflowInput = {
	id: string;
};

export const testSubscriberWorkflow = createWorkflow(
	"test-subscriber-workflow",
	function (input: WorkflowInput) {
		createTestSubscriberStep(input);
	}
);
