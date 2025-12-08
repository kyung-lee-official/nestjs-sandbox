import TesterModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export const TESTER_MODULE = "testerModuleService";

export default Module(TESTER_MODULE, {
	service: TesterModuleService,
});
