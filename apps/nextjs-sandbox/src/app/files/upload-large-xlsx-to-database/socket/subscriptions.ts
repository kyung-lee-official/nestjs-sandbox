import { useEffect, useMemo, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import {
	isActiveStatus,
	Task,
	TaskSubscriptionEvent,
	UseTaskSubscriptionReturn,
} from "../types";
import { UploadXlsxIncomingEvents } from "./websocket-events.enum";

/* Only subscribe to tasks that need real-time updates */
export const useTaskSubscription = (
	socket: Socket | null,
	tasks: Task[] = []
): UseTaskSubscriptionReturn => {
	const [subscribedTasks, setSubscribedTasks] = useState<Set<number>>(
		new Set()
	);

	const activeTasks = useMemo(
		() => tasks?.filter((task) => isActiveStatus(task.status)) || [],
		[tasks]
	);

	// const subscribeToTask = useCallback(
	// 	(taskId: number) => {
	// 		setSubscribedTasks((prevTasks) => {
	// 			if (socket?.connected && !prevTasks.has(taskId)) {
	// 				socket.emit(UploadXlsxIncomingEvents.JOIN_TASK, {
	// 					taskId,
	// 				} as TaskSubscriptionEvent);
	// 				return new Set(prevTasks).add(taskId);
	// 			}
	// 			return prevTasks;
	// 		});
	// 	},
	// 	[socket]
	// );

	// const unsubscribeFromTask = useCallback(
	// 	(taskId: number) => {
	// 		setSubscribedTasks((prevTasks) => {
	// 			if (socket?.connected && prevTasks.has(taskId)) {
	// 				socket.emit(UploadXlsxIncomingEvents.LEAVE_TASK, {
	// 					taskId,
	// 				} as TaskSubscriptionEvent);
	// 				const newSet = new Set(prevTasks);
	// 				newSet.delete(taskId);
	// 				return newSet;
	// 			}
	// 			return prevTasks;
	// 		});
	// 	},
	// 	[socket]
	// );

	const subscribeToActiveTasks = useCallback(
		(tasks: Task[]) => {
			const activeTaskIds = tasks
				.filter((task) => isActiveStatus(task.status))
				.map((t) => t.id);

			setSubscribedTasks((prevTasks) => {
				if (!socket?.connected) return prevTasks;

				const newTasks = new Set(prevTasks);
				let hasChanges = false;

				/* Join new tasks */
				activeTaskIds.forEach((id) => {
					if (!newTasks.has(id)) {
						socket.emit(UploadXlsxIncomingEvents.JOIN_TASK, {
							taskId: id,
						} as TaskSubscriptionEvent);
						newTasks.add(id);
						hasChanges = true;
					}
				});

				/* Leave old tasks */
				prevTasks.forEach((id) => {
					if (!activeTaskIds.includes(id)) {
						socket.emit(UploadXlsxIncomingEvents.LEAVE_TASK, {
							taskId: id,
						} as TaskSubscriptionEvent);
						newTasks.delete(id);
						hasChanges = true;
					}
				});

				return hasChanges ? newTasks : prevTasks;
			});
		},
		[socket]
	);

	/* Subscribe/unsubscribe efficiently when active task IDs change */
	const activeTaskIds = useMemo(
		() =>
			activeTasks
				.map((t) => t.id)
				.sort()
				.join(","),
		[activeTasks]
	);

	useEffect(() => {
		if (activeTasks.length > 0) {
			subscribeToActiveTasks(activeTasks);
		}
	}, [activeTaskIds, activeTasks, subscribeToActiveTasks]);

	/* Cleanup all subscriptions on unmount */
	useEffect(() => {
		return () => {
			setSubscribedTasks((currentTasks) => {
				if (socket?.connected) {
					currentTasks.forEach((taskId) => {
						socket.emit("leave-task", {
							taskId,
						} as TaskSubscriptionEvent);
					});
				}
				return new Set();
			});
		};
	}, [socket]);

	return {
		subscribedTasks,
		// subscribeToTask,
		// unsubscribeFromTask,
		subscribeToActiveTasks,
	};
};
