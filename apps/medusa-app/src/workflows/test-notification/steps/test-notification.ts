import { Modules } from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";

export const testNotificationStep = createStep(
  "test-notification-step",
  async ({}, { container }) => {
    const notificationModuleService = container.resolve(Modules.NOTIFICATION);

    await notificationModuleService.createNotifications({
      to: "customer@gmail.com",
      channel: "email",
      template: "product-created",
      data: {
        product_title: "Test Product",
      },
    });
  },
);
