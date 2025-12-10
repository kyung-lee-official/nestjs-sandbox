import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { testSubscriberWorkflow } from "../workflows/test-subscriber/test-subscriber";

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await testSubscriberWorkflow(container).run({
    input: {
      id: data.id,
    },
  });
}

export const config: SubscriberConfig = {
  event: `my-event`,
};
