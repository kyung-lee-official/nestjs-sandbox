"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

interface TanStackWrapperProps {
  children: ReactNode;
}

export const TanStackWrapper = ({ children }: TanStackWrapperProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
