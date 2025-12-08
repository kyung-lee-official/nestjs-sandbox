import { MedusaService } from "@medusajs/framework/utils";
import { Tester } from "./models/tester";

class TesterModuleService extends MedusaService({
	Tester,
}) {}

export default TesterModuleService;
