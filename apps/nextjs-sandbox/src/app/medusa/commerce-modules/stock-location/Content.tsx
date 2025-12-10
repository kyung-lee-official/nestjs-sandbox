"use client";

import Link from "next/link";

export const Content = () => {
  return (
    <div className="flex flex-col m-6">
      <h1>Stock Location Module</h1>
      <Link
        href="/medusa/commerce-modules/stock-location/stock-location-creation-flows"
        className="underline decoration-dotted"
      >
        Stock Location Creation Flows
      </Link>
    </div>
  );
};
