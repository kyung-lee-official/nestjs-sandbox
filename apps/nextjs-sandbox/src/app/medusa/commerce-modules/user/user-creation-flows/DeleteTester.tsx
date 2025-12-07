import { useMutation } from "@tanstack/react-query";
import { deleteUser, UserQK } from "../api";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

export const DeleteUser = (props: { userId: string }) => {
	const { userId } = props;

	const deleteUserMutation = useMutation({
		mutationFn: async (userId: string) => {
			const res = await deleteUser(userId);
			return res;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [UserQK.GET_USER_LIST],
			});
		},
		onError: (error) => {
			console.error("Delete user failed:", error);
		},
	});

	return (
		<button
			className="underline decoration-dotted"
			onClick={() => deleteUserMutation.mutate(userId)}
		>
			Delete
		</button>
	);
};
