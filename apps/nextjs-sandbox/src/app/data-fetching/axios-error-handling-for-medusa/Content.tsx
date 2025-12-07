import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getNonExistentEndpoint, getUserById } from "./api";

type FormData = {
	userId: number;
};

const Content = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const mutation = useMutation({
		mutationFn: async (userId: number) => {
			const res = await getUserById(userId);
			return res;
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const nonExistentMutation = useMutation({
		mutationFn: async () => {
			const res = await getNonExistentEndpoint();
			return res;
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const onSubmit = (data: FormData) => {
		mutation.mutate(data.userId);
	};

	return (
		<div className="p-4">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
				<div className="space-x-1">
					<label htmlFor="userId">User ID</label>
					<input
						className="border"
						id="userId"
						type="number"
						{...register("userId", {
							required: "User ID is required",
							valueAsNumber: true,
						})}
					/>
					{errors.userId && <p>{errors.userId.message}</p>}
				</div>
				<button
					type="submit"
					disabled={mutation.isPending}
					className="rounded bg-blue-500 p-1 text-white"
				>
					{mutation.isPending ? "Loading..." : "Get User"}
				</button>
			</form>

			{mutation.isError && (
				<div>
					<p>Error:</p>
					<p>
						{mutation.error instanceof Error
							? mutation.error.message
							: "An error occurred"}
					</p>
				</div>
			)}

			{mutation.isSuccess && (
				<div>
					<p>Success!</p>
					<pre>{JSON.stringify(mutation.data, null, 2)}</pre>
				</div>
			)}

			<button
				type="button"
				onClick={() => nonExistentMutation.mutate()}
				disabled={nonExistentMutation.isPending}
				className="rounded bg-red-500 p-1 text-white"
			>
				{mutation.isPending ? "Loading..." : "Get Non-Existent Endpoint"}
			</button>
		</div>
	);
};

export default Content;
