import { Module } from "@medusajs/framework/utils";
import TesterModuleService from "./service";

export const TESTER_MODULE = "testerModuleService";

export default Module(TESTER_MODULE, {
  service: TesterModuleService,
});
