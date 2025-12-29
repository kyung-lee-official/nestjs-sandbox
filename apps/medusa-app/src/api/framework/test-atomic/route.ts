import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { testAtomicWorkflow } from "@/workflows/test-atomic/test-atomic";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const interrupt = req.query.interrupt === "true";
  const { result } = await testAtomicWorkflow(req.scope).run({
    input: {
      interrupt: interrupt,
    },
  });
  res.status(200).json({ result });
}
