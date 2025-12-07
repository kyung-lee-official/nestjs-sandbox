"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import Content from "./Content";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

export const QueryClientWrapper = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Content />
		</QueryClientProvider>
	);
};
