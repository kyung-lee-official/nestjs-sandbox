"use client";

import { AccessToken } from "./AccessToken";
import { CreateOrder } from "./create-order/CreateOrder";

type ContentProps = {
  paypalAccessToken?: string;
};

export const Content = ({ paypalAccessToken }: ContentProps) => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">PayPal Orders API Integration</h1>

      <AccessToken paypalAccessToken={paypalAccessToken} />

      <CreateOrder paypalAccessToken={paypalAccessToken} />
    </div>
  );
};
