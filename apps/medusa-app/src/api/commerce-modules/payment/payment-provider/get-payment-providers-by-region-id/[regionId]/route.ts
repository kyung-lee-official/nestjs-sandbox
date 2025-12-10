import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { regionId } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: regionPaymentProviders } = await query.graph({
    entity: "region_payment_provider",
    filters: {
      region_id: regionId,
    },
    fields: ["payment_provider.*"],
  });

  const paymentProviders = regionPaymentProviders.map(
    (relation) => relation.payment_provider,
  );

  return res.status(200).json(paymentProviders);
}
