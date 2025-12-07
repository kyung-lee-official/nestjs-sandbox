"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { inviteUser } from "../api";

type InviteForm = {
	email: string;
};

export const Content = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<InviteForm>();

	const inviteMutation = useMutation({
		mutationFn: async (email: string) => {
			const res = await inviteUser(email);
			return res;
		},
		onSuccess: () => {
			console.log("Invite sent successfully");
			reset();
		},
		onError: (error) => {
			console.error("Failed to send invite:", error);
		},
	});

	const onSubmit = async (data: InviteForm) => {
		inviteMutation.mutate(data.email);
	};

	return (
		<div className="m-6 space-y-4">
			<Link
				href={
					"https://docs.medusajs.com/resources/commerce-modules/user/invite-user-subscriber"
				}
				className="underline decoration-dotted"
			>
				Invite User Email
			</Link>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium"
					>
						Email Address
					</label>
					<input
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Invalid email address",
							},
						})}
						type="email"
						id="email"
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						placeholder="Enter email address"
					/>
					{errors.email && (
						<p className="mt-1 text-sm text-red-600">
							{errors.email.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSubmitting ? "Sending..." : "Send Invite"}
				</button>
			</form>
		</div>
	);
};
