import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";

type WorkflowInput = {
  cart_id: string;
};

export const getCartDetailsWorkflow = createWorkflow(
  "get-cart-details",
  (input: WorkflowInput) => {
    const { data: carts } = useQueryGraphStep({
      entity: "cart",
      fields: [
        "id",
        "items.*",
        "shipping_methods.*",
        "shipping_address.*",
        "billing_address.*",
        "region.*",
        "sales_channel.*",
        "promotions.*",
        "currency_code",
        "subtotal",
        "item_total",
        "total",
        "item_subtotal",
        "shipping_subtotal",
        "customer.*",
        "payment_collection.*",
      ],
      filters: {
        id: input.cart_id,
      },
    });

    return new WorkflowResponse(carts[0]);
  },
);
