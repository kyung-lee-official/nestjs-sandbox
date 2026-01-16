import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { token, PayerID } = req.query;
  res.send("PayPal Order API V2 Return Route");
}
