"use client";

import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

interface TanStackWrapperProps {
	children: ReactNode;
}

export const TanStackWrapper = ({ children }: TanStackWrapperProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};
