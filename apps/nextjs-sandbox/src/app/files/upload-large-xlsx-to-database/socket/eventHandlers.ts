import { Socket } from "socket.io-client";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { UploadLargeXlsxToDatabaseQK } from "../api";
import {
	DbTaskStatus,
	RedisProgressStatus,
	Task,
	TaskCompletionEvent,
	TaskProgressEmittedData,
	TaskWithProgress,
} from "../types";
import { UploadXlsxOutgoingEvents } from "./websocket-events.enum";

/* Event handler functions for Socket.io events */

export const handleTaskProgress = (progressData: TaskProgressEmittedData) => {
	/* Update task progress in real-time with optimistic updates across all cached pages */
	queryClient.setQueriesData(
		{
			queryKey: [UploadLargeXlsxToDatabaseQK.GET_TASKS],
			exact: false /* This allows matching any query that starts with this key */,
		},
		(oldData: any) => {
			if (!oldData || !Array.isArray(oldData)) return oldData;

			return oldData.map((task: Task) =>
				task.id === progressData.taskId
					? ({
							...task,
							phase: progressData.phase as RedisProgressStatus,
							progress: progressData.progress,
					  } as TaskWithProgress)
					: task
			);
		}
	);
};

export const handleTaskCompletion = (completionData: TaskCompletionEvent) => {
	/* 1. Immediate optimistic update across all cached pages */
	queryClient.setQueriesData(
		{
			queryKey: [UploadLargeXlsxToDatabaseQK.GET_TASKS],
			exact: false /* This allows matching any query that starts with this key */,
		},
		(oldData: any) => {
			if (!oldData || !Array.isArray(oldData)) return oldData;

			return oldData.map((task: Task) =>
				task.id === completionData.taskId
					? {
							...task,
							status: completionData.status as DbTaskStatus,
							progress: 100,
					  }
					: task
			);
		}
	);

	/* 2. Fetch fresh data to ensure consistency */
	setTimeout(() => {
		queryClient.invalidateQueries({
			queryKey: [UploadLargeXlsxToDatabaseQK.GET_TASKS],
			exact: false, // Invalidate all pages
		});
	}, 1000); /* Small delay to let backend settle */
};

export const handleTaskFailure = (failureData: TaskCompletionEvent) => {
	/* Handle task failure similar to completion but with error status across all cached pages */
	queryClient.setQueriesData(
		{
			queryKey: [UploadLargeXlsxToDatabaseQK.GET_TASKS],
			exact: false /* This allows matching any query that starts with this key */,
		},
		(oldData: any) => {
			if (!oldData || !Array.isArray(oldData)) return oldData;

			return oldData.map((task: Task) =>
				task.id === failureData.taskId
					? {
							...task,
							status: "FAILED" as Task["status"],
					  }
					: task
			);
		}
	);

	/* Invalidate to get authoritative error details */
	setTimeout(() => {
		queryClient.invalidateQueries({
			queryKey: [UploadLargeXlsxToDatabaseQK.GET_TASKS],
			exact: false, // Invalidate all pages
		});
	}, 500);
};

/* Handle conflicts between HTTP and WebSocket data */
// export const mergeTaskData = (httpTask: Task, socketUpdate: Partial<Task>) => {
// 	return {
// 		...httpTask,
// 		...socketUpdate,
// 		/* HTTP data takes precedence for critical fields */
// 		id: httpTask.id,
// 		createdAt: httpTask.createdAt,
// 		/* WebSocket data enhances with real-time info */
// 		validationProgress:
// 			socketUpdate.validatedRows ?? httpTask.validatedRows,
// 		savingProgress: socketUpdate.savedRows ?? httpTask.savedRows,
// 		updatedAt: new Date().toISOString() /* Mark as recently updated */,
// 	};
// };

/* Setup event listeners for a socket connection */
export const setupSocketEventListeners = (socket: Socket | null) => {
	if (!socket) return () => {};

	/* Register event handlers */
	socket.on(UploadXlsxOutgoingEvents.TASK_PROGRESS, handleTaskProgress);
	socket.on(UploadXlsxOutgoingEvents.TASK_COMPLETED, handleTaskCompletion);
	socket.on(UploadXlsxOutgoingEvents.TASK_FAILED, handleTaskFailure);

	/* Return cleanup function */
	return () => {
		socket.off(UploadXlsxOutgoingEvents.TASK_PROGRESS, handleTaskProgress);
		socket.off(
			UploadXlsxOutgoingEvents.TASK_COMPLETED,
			handleTaskCompletion
		);
		socket.off(UploadXlsxOutgoingEvents.TASK_FAILED, handleTaskFailure);
	};
};
