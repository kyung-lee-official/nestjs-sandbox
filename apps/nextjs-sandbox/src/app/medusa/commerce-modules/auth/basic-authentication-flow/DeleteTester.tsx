import { useMutation } from "@tanstack/react-query";
import { deleteTester, TesterQK } from "./api";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

export const DeleteTester = (props: { testerId: string }) => {
	const { testerId } = props;

	const deleteTesterMutation = useMutation({
		mutationFn: async (testerId: string) => {
			const res = await deleteTester(testerId);
			return res;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [TesterQK.GET_TESTER_LIST],
			});
		},
		onError: (error) => {
			console.error("Delete tester failed:", error);
		},
	});

	return (
		<button
			className="underline decoration-dotted"
			onClick={() => deleteTesterMutation.mutate(testerId)}
		>
			Delete
		</button>
	);
};
