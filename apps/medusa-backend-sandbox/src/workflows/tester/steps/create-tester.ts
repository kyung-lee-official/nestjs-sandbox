import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";
import { TESTER_MODULE } from "../../../modules/tester";
import TesterModuleService from "../../../modules/tester/service";
import { CreateTester } from "../../../modules/tester/types";

export const createTesterStep = createStep(
	"create-tester-step",
	async function (data: CreateTester, { container }) {
		const testerModuleService: TesterModuleService =
			container.resolve(TESTER_MODULE);

		const tester = await testerModuleService.createTesters(data);

		return new StepResponse(tester, tester.id);
	},
	function (id: string, { container }) {
		const testerModuleService: TesterModuleService =
			container.resolve(TESTER_MODULE);

		return testerModuleService.deleteTesters(id);
	}
);
