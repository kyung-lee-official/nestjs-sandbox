import { useMutation } from "@tanstack/react-query";
import React from "react";
import { ProductQK, softDeleteProduct } from "../api";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

type DeleteProductProps = {
	productId: string;
};

export const SoftDeleteProduct = (props: DeleteProductProps) => {
	const { productId } = props;

	const deleteProductMutation = useMutation({
		mutationFn: async (productId: string) => {
			return await softDeleteProduct(productId);
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
			onClick={() => deleteProductMutation.mutate(productId)}
		>
			Take down
		</button>
	);
};
