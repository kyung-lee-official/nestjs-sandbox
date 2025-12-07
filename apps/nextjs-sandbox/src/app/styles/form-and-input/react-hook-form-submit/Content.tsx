"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Form } from "./Form";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

const Content = () => {
	return (
		<div className="w-96 p-10">
			<QueryClientProvider client={queryClient}>
				<Form />
			</QueryClientProvider>
		</div>
	);
};

export default Content;
