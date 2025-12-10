"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

type PayPalWrapperProps = {
  children: React.ReactNode;
};

export const PayPalWrapper = ({ children }: PayPalWrapperProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
