import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { sendOrderConfirmationWorkflow } from "../../../workflows/test-notification/steps/send-order-notification";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	await sendOrderConfirmationWorkflow(req.scope).run({});
	return res.status(200).json({ status: "ok" });
}
