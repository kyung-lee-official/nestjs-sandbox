import { useEffect, useMemo } from "react";
import { isActiveStatus, type Task } from "../types";
import { useSocketConnection } from "./connection";
import { setupSocketEventListeners } from "./eventHandlers";
import { useTaskSubscription } from "./subscriptions";

/* Main hook that combines connection, subscription, and event handling */
export const useSocketEnhancement = (tasks: Task[] = []) => {
  const { socket, connectionState, connect, disconnect } =
    useSocketConnection();
  const { subscribedTasks, subscribeToActiveTasks } = useTaskSubscription(
    socket,
    tasks,
  );

  /* Memoize active tasks to prevent unnecessary re-renders */
  const activeTasks = useMemo(
    () => tasks?.filter((task) => isActiveStatus(task.status)) || [],
    [tasks],
  );

  /* Connect when there are active tasks */
  const hasActiveTasks = activeTasks.length > 0;
  useEffect(() => {
    if (hasActiveTasks) {
      connect();
    } else {
      disconnect();
    }
  }, [hasActiveTasks, connect, disconnect]);

  /* Setup event listeners */
  useEffect(() => {
    if (!socket) return;

    const cleanup = setupSocketEventListeners(socket);
    return cleanup;
  }, [socket]);

  /* Subscribe to active tasks when they change - use JSON.stringify for stable comparison */
  const activeTaskIds = useMemo(
    () =>
      activeTasks
        .map((t) => t.id)
        .sort()
        .join(","),
    [activeTasks],
  );

  useEffect(() => {
    if (socket?.connected && activeTasks.length > 0) {
      subscribeToActiveTasks(activeTasks);
    }
  }, [socket?.connected, activeTaskIds, activeTasks, subscribeToActiveTasks]);

  return {
    connectionState,
    subscribedTasks,
    isConnected: socket?.connected || false,
  };
};

/* Simplified hook for components that just need connection status */
// export const useSocketStatus = () => {
// 	const { socket, connectionState } = useSocketConnection();

// 	return {
// 		isConnected: socket?.connected || false,
// 		connectionState,
// 	};
// };

/* Prevent UI thrashing from rapid WebSocket updates */
// export const useDebouncedProgress = (rawProgress: number): number => {
// 	const [debouncedProgress, setDebouncedProgress] = useState(rawProgress);

// 	useEffect(() => {
// 		const timer = setTimeout(() => {
// 			setDebouncedProgress(rawProgress);
// 		}, 100); /* Update UI max every 100ms */

// 		return () => clearTimeout(timer);
// 	}, [rawProgress]);

// 	return debouncedProgress;
// };
