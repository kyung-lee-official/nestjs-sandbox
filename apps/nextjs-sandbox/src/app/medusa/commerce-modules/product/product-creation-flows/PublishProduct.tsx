import { useMutation } from "@tanstack/react-query";
import React from "react";
import { ProductQK, publishProduct } from "../api";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

type PublishProductProps = {
	productId: string;
};

export const PublishProduct = (props: PublishProductProps) => {
	const { productId } = props;

	const publishProductMutation = useMutation({
		mutationFn: async (productId: string) => {
			return await publishProduct(productId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [ProductQK.GET_PRODUCT_LIST],
			});
		},
	});

	return (
		<button
			className="underline decoration-dotted cursor-pointer"
			onClick={() => publishProductMutation.mutate(productId)}
		>
			Publish
		</button>
	);
};
