"use client";

import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface TanStackWrapperProps {
	children: React.ReactNode;
}

export const TanStackWrapper = ({ children }: TanStackWrapperProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};
