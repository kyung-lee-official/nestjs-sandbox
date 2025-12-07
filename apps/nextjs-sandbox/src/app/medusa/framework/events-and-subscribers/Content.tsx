"use client";

import { useMutation } from "@tanstack/react-query";
import { emitTestEvent } from "./api";

export const Content = () => {
	const emitEventMutation = useMutation({
		mutationFn: async () => {
			const res = await emitTestEvent();
			return res;
		},
	});

	if (emitEventMutation.isPending) {
		return <div>Loading...</div>;
	}

	if (emitEventMutation.error) {
		return <div>Error: {emitEventMutation.error.message}</div>;
	}

	return (
		<div className="m-4">
			<button
				className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				onClick={() => emitEventMutation.mutate()}
			>
				Emit Test Event
			</button>
			{emitEventMutation.isSuccess && (
				<div className="mt-2 text-green-600">
					Test event emitted successfully!
				</div>
			)}
		</div>
	);
};
