"use client";

import { useQuery } from "@tanstack/react-query";
import { FulfillmentQK, getShippingOptionById } from "../../api";

type ContentProps = {
  shippingOptionId: string;
};

export const Content = (props: ContentProps) => {
  const { shippingOptionId } = props;

  const shippingOptionQuery = useQuery({
    queryKey: [FulfillmentQK.GET_SHIPPING_OPTION_BY_ID, shippingOptionId],
    queryFn: () => getShippingOptionById(shippingOptionId),
    enabled: !!shippingOptionId,
  });

  if (shippingOptionQuery.isLoading) {
    return (
      <div className="flex flex-col m-6">
        <div className="text-gray-400">Loading shipping option...</div>
      </div>
    );
  }

  if (shippingOptionQuery.isError) {
    return (
      <div className="flex flex-col m-6">
        <div className="text-red-400">
          Error loading shipping option:{" "}
          {shippingOptionQuery.error?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  const shippingOption = shippingOptionQuery.data;

  return (
    <div className="flex flex-col m-6 space-y-4">
      <h1 className="text-xl font-semibold">Shipping Option Details</h1>

      <div className="space-y-2">
        <div>
          <strong>ID:</strong> {shippingOptionId}
        </div>
        <div>
          <strong>Name:</strong> {shippingOption?.name || "N/A"}
        </div>
        <div>
          <strong>Type:</strong> {shippingOption?.type.label || "N/A"}
        </div>
        <div>
          <strong>Provider:</strong> {shippingOption?.provider.id || "N/A"}
        </div>
        <div>
          <strong>Shipping Profile:</strong>{" "}
          {shippingOption?.shipping_profile.name || "N/A"}
        </div>
      </div>

      {/* Raw data for debugging */}
      <details className="mt-6">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
          Show Raw Data
        </summary>
        <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
          {JSON.stringify(shippingOption, null, 2)}
        </pre>
      </details>
    </div>
  );
};
