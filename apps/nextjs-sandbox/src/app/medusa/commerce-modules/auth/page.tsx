import Link from "next/link";

const Page = () => {
  return (
    <div className="m-6 space-y-2">
      <h1>Auth Module</h1>
      <Link
        href="/medusa/commerce-modules/auth/basic-authentication-flow"
        className="underline decoration-dotted"
      >
        Basic Authentication Flow
      </Link>
    </div>
  );
};

export default Page;
