import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api";

export const TestLoginToken = () => {
	const loginMutation = useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			const res = await loginUser(data.email, data.password);
			return res;
		},
	});

	return (
		<div className="w-full">
			<h1>
				Test Login (Note that auth info is recorded separately in
				auth_identity table and provider_identity table, deleting user
				doesn&#39;t prevent login)
			</h1>
			<button
				className="underline decoration-dotted"
				onClick={() =>
					loginMutation.mutate({
						email: "user1@example.com",
						password: "supersecret",
					})
				}
			>
				Login
			</button>
			<div>token: {loginMutation.data?.token}</div>
		</div>
	);
};
