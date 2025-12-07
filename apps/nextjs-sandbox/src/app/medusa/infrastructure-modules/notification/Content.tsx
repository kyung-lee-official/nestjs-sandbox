"use client";

import { useMutation } from "@tanstack/react-query";
import { resendTestNotification } from "./api";

export const Content = () => {
	const resendNotificationMutation = useMutation({
		mutationFn: async () => {
			const res = await resendTestNotification();
			return res;
		},
	});

	if (resendNotificationMutation.isPending) {
		return <div>Loading...</div>;
	}

	if (resendNotificationMutation.error) {
		return <div>Error: {resendNotificationMutation.error.message}</div>;
	}

	return (
		<div className="m-4">
			<button
				className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				onClick={() => resendNotificationMutation.mutate()}
			>
				Resend Test Notification
			</button>
			{resendNotificationMutation.isSuccess && (
				<div className="mt-2 text-green-600">
					Test notification sent successfully!
				</div>
			)}
		</div>
	);
};
