import { Modules } from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";
import { WorkflowInput } from "../test-subscriber";

export const createTestSubscriberStep = createStep(
	"create-test-subscriber-step",
	async ({ id }: WorkflowInput, { container }) => {
		const eventBusModuleService = container.resolve(Modules.EVENT_BUS);
		console.log("======== an emitted event was detected ========");
		console.log(`ID: ${id}`);
		// TODO use eventModuleService
	}
);
