import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils";
import { addToCartWorkflow } from "@medusajs/medusa/core-flows";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const regionModuleService = req.scope.resolve(Modules.REGION);
  const salesChannelModuleService = req.scope.resolve(Modules.SALES_CHANNEL);
  const { cartId } = req.params;

  // const cartModuleService = req.scope.resolve(Modules.CART);
  // const cart = await cartModuleService.retrieveCart(cartId, {
  // 	relations: ["shipping_address", "shipping_methods"],
  // });

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: carts } = await query.graph({
    entity: "cart",
    fields: [
      "*",
      "shipping_address.*",
      "shipping_methods.*",
      "payment_collection.*",
    ],
  });
  const cart = carts.find((c) => c.id === cartId);

  if (!cart) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Cart not found");
  }

  /* get cart region */
  const region = cart.region_id
    ? await regionModuleService.retrieveRegion(cart.region_id)
    : null;

  /* get cart sales channel (if any) */
  const salesChannel = cart.sales_channel_id
    ? await salesChannelModuleService.retrieveSalesChannel(
        cart.sales_channel_id,
      )
    : null;

  /* add region name to each cart */
  const cartWithDetails = {
    ...cart,
    region_name: region ? region.name : null,
    sales_channel_name: salesChannel ? salesChannel.name : null,
  };

  return res.status(200).json(cartWithDetails);
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { cartId } = req.params;
  const { items } = req.body as any;
  const cartModuleService = req.scope.resolve(Modules.CART);

  if (!cartId) {
    return res.status(400).json({ error: "Missing cart ID" });
  }
  const cart = await cartModuleService.retrieveCart(cartId);
  if (!cart) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Cart not found");
  }

  const { result } = await addToCartWorkflow(req.scope).run({
    input: {
      cart_id: cartId,
      items: items,
    },
  });

  return res.status(200).json(result);
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { cartId } = req.params;
  const cartModuleService = req.scope.resolve(Modules.CART);

  if (!cartId) {
    return res.status(400).json({ error: "Missing cart ID" });
  }

  const cart = await cartModuleService.retrieveCart(cartId);
  if (!cart) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Cart not found");
  }

  await cartModuleService.deleteCarts(cartId);

  return res.status(204).send();
}
