import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { TESTER_MODULE } from "../../../modules/tester";
import type TesterModuleService from "../../../modules/tester/service";
import type { CreateTester } from "../../../modules/tester/types";

export const createTesterStep = createStep(
  "create-tester-step",
  async (data: CreateTester, { container }) => {
    const testerModuleService: TesterModuleService =
      container.resolve(TESTER_MODULE);

    const tester = await testerModuleService.createTesters(data);

    return new StepResponse(tester, tester.id);
  },
  (id: string, { container }) => {
    const testerModuleService: TesterModuleService =
      container.resolve(TESTER_MODULE);

    return testerModuleService.deleteTesters(id);
  },
);
