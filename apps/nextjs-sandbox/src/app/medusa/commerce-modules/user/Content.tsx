"use client";

import Link from "next/link";

export const Content = () => {
  return (
    <div className="flex flex-col m-6">
      <h1>User Module</h1>
      <Link
        href="/medusa/commerce-modules/user/user-creation-flows"
        className="underline decoration-dotted"
      >
        User Creation Flows
      </Link>
      <Link
        href="/medusa/commerce-modules/user/invite-user-email"
        className="underline decoration-dotted"
      >
        Invite User Email
      </Link>
    </div>
  );
};
