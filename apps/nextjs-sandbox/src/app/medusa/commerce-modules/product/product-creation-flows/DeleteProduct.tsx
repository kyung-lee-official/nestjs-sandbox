import { useMutation } from "@tanstack/react-query";
import React from "react";
import { deleteProduct, ProductQK } from "../api";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

type DeleteProductProps = {
	productId: string;
};

export const DeleteProduct = (props: DeleteProductProps) => {
	const { productId } = props;

	const deleteProductMutation = useMutation({
		mutationFn: async (productId: string) => {
			return await deleteProduct(productId);
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
			Delete
		</button>
	);
};
