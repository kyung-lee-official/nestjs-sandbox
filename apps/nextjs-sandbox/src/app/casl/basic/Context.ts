"use client";

import { defineAbility } from "@casl/ability";
import { createContext } from "react";

export const ability = defineAbility((can, cannot) => {
  can("read", "Post");
  can("add", "Post");
  cannot("update", "Post");
  cannot("delete", "Post");
});

export const AbilityContext = createContext(ability);
