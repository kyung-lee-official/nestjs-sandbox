import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createStockLocation, StockLocationQK } from "../api";

type StockLocationForm = {
	name: string;
};

export const CreateStockLocation = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<StockLocationForm>();

	const createStockLocationMutation = useMutation({
		mutationFn: async (data: StockLocationForm) => {
			const res = await createStockLocation(data.name);
			return res;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [StockLocationQK.GET_STOCK_LOCATION_LIST],
			});
		},
		onError: (error) => {
			console.error("Failed to create stock location:", error);
		},
	});

	const onSubmit = (data: StockLocationForm) => {
		createStockLocationMutation.mutate(data);
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<input
						{...register("name", {
							required: "Stock location name is required",
							minLength: {
								value: 2,
								message: "Name must be at least 2 characters",
							},
						})}
						type="text"
						placeholder="Stock Location Name"
						defaultValue={"USA Warehouse"}
						className="px-3 py-2 border border-gray-300 rounded"
					/>
					{errors.name && (
						<p className="mt-1 text-sm text-red-600">
							{errors.name.message}
						</p>
					)}
				</div>
				<button
					type="submit"
					disabled={
						isSubmitting || createStockLocationMutation.isPending
					}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
				>
					{createStockLocationMutation.isPending
						? "Creating..."
						: "Create"}
				</button>
			</form>
		</div>
	);
};
