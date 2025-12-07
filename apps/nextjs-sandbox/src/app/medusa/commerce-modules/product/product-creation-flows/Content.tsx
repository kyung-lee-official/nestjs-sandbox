"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { createProducts } from "../api";
import { ProductQK } from "../api";
import { ProductList } from "./ProductList";

type CreateProductForm = {
	title: string;
	options: { title: string; value: string }[];
	variants: {
		title: string;
		sku: string;
		options: any;
		price: any[];
	}[];
};

export const Content = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateProductForm>();

	const createProductsMutation = useMutation({
		mutationFn: async (data: CreateProductForm) => {
			const res = await createProducts([
				{
					title: "Shirt",
					options: [{ title: "Size", values: ["S", "M", "L"] }],
					variants: [
						{
							title: "Small Shirt",
							sku: "SMALLSHIRT",
							options: {
								Size: "S",
							},
							prices: [
								{
									amount: 10,
									currency_code: "usd",
								},
							],
							manage_inventory: true,
						},
					],
				},
			]);
			return res;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [ProductQK.GET_PRODUCT_LIST],
			});
		},
		onError: (error) => {
			console.error("Creation error:", error);
		},
	});

	return (
		<div className="m-6 space-y-4">
			<Link
				href={
					"https://docs.medusajs.com/resources/references/medusa-workflows/createProductsWorkflow"
				}
				className="underline decoration-dotted"
			>
				Product Creation Flow
			</Link>
			<form
				onSubmit={handleSubmit((data) =>
					createProductsMutation.mutate(data)
				)}
				className="flex flex-col gap-4 max-w-sm"
			>
				<div>
					<label>Title</label>
					<input
						{...register("title", {
							required: "Title is required",
						})}
						defaultValue="Shirt"
						className="block w-full px-3 py-2 border rounded"
					/>
					{errors.title && (
						<span className="text-red-500">
							{errors.title.message}
						</span>
					)}
				</div>

				<button
					type="submit"
					disabled={createProductsMutation.isPending}
					className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
				>
					{createProductsMutation.isPending
						? "Creating..."
						: "Create"}
				</button>
			</form>
			<ProductList />
		</div>
	);
};
