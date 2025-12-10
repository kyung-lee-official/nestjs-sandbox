"use client";

import { createContextualCan } from "@casl/react";
import { AbilityContext, ability } from "./Context";

const Can = createContextualCan(AbilityContext.Consumer);

const Casl = (props: any) => {
  const { action, subject, content } = props;
  return (
    <Can do={action} on={subject}>
      <div>{content}</div>
    </Can>
  );
};

const Content = () => {
  return (
    <div
      className="flex flex-col justify-center items-center p-10 gap-10
			text-gray-400"
    >
      <a
        href="https://dev.to/naufalafif/dynamic-permissions-in-react-using-casl-a-guide-to-secure-your-app-2ino"
        className="underline"
      >
        Dynamic Permissions in React using CASL: A Guide to Secure Your App🔒
      </a>
      Modify the ability in code to see the changes in the content.
      <AbilityContext.Provider value={ability}>
        <div className="flex flex-col justify-center items-center gap-6">
          <Casl action="read" subject="Post" content="Can read posts" />
          <Casl action="update" subject="Post" content="Can update posts" />
        </div>
      </AbilityContext.Provider>
    </div>
  );
};

export default Content;
