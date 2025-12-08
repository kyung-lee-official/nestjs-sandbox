import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { MedusaError } from "@medusajs/framework/utils";
import { testerSchema } from "./validation-schemas";
import { CreateTester } from "../../modules/tester/types";
import { createTesterWorkflow } from "../../workflows/tester/create-tester";
import { TESTER_MODULE } from "../../modules/tester";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
	const validatedBody = testerSchema.parse(req.body) as CreateTester;

	if (!validatedBody) {
		return MedusaError.Types.INVALID_DATA;
	}

	const { result: tester } = await createTesterWorkflow(req.scope).run({
		input: {
			tester: validatedBody,
		},
	});

	return res.status(200).json({ tester });
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	// const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
	// const { data } = await query.graph({
	// 	entity: "tester",
	// 	fields: ["id", "first_name", "last_name", "email"],
	// });

	const testerModuleService = req.scope.resolve(TESTER_MODULE);

	const data = await testerModuleService.listTesters();
	return res.status(200).json(data);
}
