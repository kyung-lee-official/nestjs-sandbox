"use client";

import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

export const Wrapper = (props: { children: ReactNode }) => {
	const { children } = props;
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</QueryClientProvider>
	);
};
