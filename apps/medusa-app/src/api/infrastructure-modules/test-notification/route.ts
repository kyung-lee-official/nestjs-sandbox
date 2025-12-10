import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { testNotificationWorkflow } from "../../../workflows/test-notification/test-notification";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  await testNotificationWorkflow(req.scope).run({});
  return res.status(200).json({ status: "ok" });
}
