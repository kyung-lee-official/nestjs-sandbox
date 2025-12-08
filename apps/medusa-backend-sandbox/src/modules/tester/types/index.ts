import { InferTypeOf } from "@medusajs/framework/types";
import TesterModuleService from "../service";
import { Tester } from "../models/tester";

export type CreateTester = Omit<InferTypeOf<typeof Tester>, "id">;

declare module "@medusajs/framework/types" {
	export interface ModuleImplementations {
		TesterModuleService: TesterModuleService;
	}
}
