"use client";

import Link from "next/link";
// import { MockType } from "../../../../node_modules/cool-pkg-sandbox/src";

const Content = () => {
  // const mock: MockType = {
  // 	name: "John Doe",
  // 	age: 25,
  // };

  return (
    <div className="flex flex-col p-6">
      <Link href={"https://bun.sh/docs/cli/link"} className="underline">
        https://bun.sh/docs/cli/link
      </Link>
    </div>
  );
};

export default Content;
