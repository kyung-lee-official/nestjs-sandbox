"use client";

import { AccessToken } from "./AccessToken";
import { CreateOrder } from "./create-order/CreateOrder";

type ContentProps = {
  paypalAccessToken: string;
};

export const Content = ({ paypalAccessToken }: ContentProps) => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="font-bold text-2xl">PayPal Orders API Integration</h1>

      <AccessToken paypalAccessToken={paypalAccessToken} />

      <CreateOrder paypalAccessToken={paypalAccessToken} />
    </div>
  );
};
