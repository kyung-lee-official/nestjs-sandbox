"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../tanstack-query/queryClient";
import Content from "./Content";

export const Wrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Content />
    </QueryClientProvider>
  );
};
