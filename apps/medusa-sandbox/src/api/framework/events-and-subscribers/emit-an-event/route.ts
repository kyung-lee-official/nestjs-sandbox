import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { emitMyEventWorkflow } from "../../../../workflows/test-subscriber/emit-event";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  await emitMyEventWorkflow(req.scope).run({});
  return res.status(200).json({ status: "ok" });
}
