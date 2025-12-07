"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTaskById, UploadLargeXlsxToDatabaseQK } from "../api";
import { useState } from "react";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

interface DeleteProps {
	taskId: string;
}

export const Delete = ({ taskId }: DeleteProps) => {
	const [showConfirm, setShowConfirm] = useState(false);

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteTaskById(id),
		onSuccess: (data) => {
			/* Invalidate and refetch tasks list */
			queryClient.invalidateQueries({
				queryKey: [UploadLargeXlsxToDatabaseQK.GET_TASKS],
			});
			setShowConfirm(false);
		},
		onError: (error: Error) => {
			setShowConfirm(false);
			/* Show error message */
			alert(`Failed to delete task: ${error.message}`);
		},
	});

	const handleDeleteClick = () => {
		setShowConfirm(true);
	};

	const handleConfirmDelete = () => {
		deleteMutation.mutate(taskId);
	};

	const handleCancelDelete = () => {
		setShowConfirm(false);
	};

	if (showConfirm) {
		return (
			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-600">Delete task?</span>
				<button
					onClick={handleConfirmDelete}
					disabled={deleteMutation.isPending}
					className={`px-2 py-1 text-xs rounded transition-colors ${
						deleteMutation.isPending
							? "bg-gray-400 cursor-not-allowed"
							: "bg-red-600 hover:bg-red-700"
					} text-white
					cursor-pointer`}
				>
					{deleteMutation.isPending ? "Deleting..." : "Yes"}
				</button>
				<button
					onClick={handleCancelDelete}
					disabled={deleteMutation.isPending}
					className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors
					cursor-pointer"
				>
					Cancel
				</button>
			</div>
		);
	}

	return (
		<button
			onClick={handleDeleteClick}
			className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors border border-red-300
			cursor-pointer"
			title="Delete task"
		>
			Delete
		</button>
	);
};
