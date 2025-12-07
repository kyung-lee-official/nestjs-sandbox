import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { CustomerQK, deleteCustomer } from "../api";

export const DeleteCustomer = (props: { customerId: string }) => {
	const { customerId } = props;

	const deleteCustomerMutation = useMutation({
		mutationFn: async (customerId: string) => {
			const res = await deleteCustomer(customerId);
			return res;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [CustomerQK.GET_CUSTOMER_LIST],
			});
		},
		onError: (error) => {
			console.error("Delete customer failed:", error);
		},
	});

	return (
		<button
			className="underline decoration-dotted"
			onClick={() => deleteCustomerMutation.mutate(customerId)}
		>
			Delete
		</button>
	);
};
