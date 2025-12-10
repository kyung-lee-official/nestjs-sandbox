"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import Content from "./Content";

export const QueryClientWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Content />
    </QueryClientProvider>
  );
};
