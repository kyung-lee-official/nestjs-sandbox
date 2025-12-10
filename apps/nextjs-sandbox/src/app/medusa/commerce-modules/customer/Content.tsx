"use client";

import Link from "next/link";
import { CustomerList } from "./customer-creation-flows/CustomerList";

export const Content = () => {
  return (
    <div className="m-6 space-y-6">
      <div>
        <h1>Customer Module</h1>
        <Link
          href="/medusa/commerce-modules/customer/customer-creation-flows"
          className="underline decoration-dotted"
        >
          Customer Creation Flows
        </Link>
      </div>
      <CustomerList />
    </div>
  );
};
