import { createWorkflow } from "@medusajs/framework/workflows-sdk";
import { emitEventStep } from "@medusajs/medusa/core-flows";

export const emitMyEventWorkflow = createWorkflow("emit-my-event", () => {
	emitEventStep({
		eventName: "my-event",
		data: {
			id: "hello-world",
		},
	});
});
