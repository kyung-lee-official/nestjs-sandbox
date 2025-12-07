"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../data-fetching/tanstack-query/queryClient";
import { ReactNode } from "react";
import { Header } from "./Header";

type MedusaWrapperProps = {
	regionId: string | undefined;
	salesChannelId: string | undefined;
	customerId: string | undefined;
	children: ReactNode;
};

export const MedusaWrapper = (props: MedusaWrapperProps) => {
	const { children, regionId, salesChannelId, customerId } = props;
	return (
		<QueryClientProvider client={queryClient}>
			<Header
				regionId={regionId}
				salesChannelId={salesChannelId}
				customerId={customerId}
			/>
			{children}
		</QueryClientProvider>
	);
};
