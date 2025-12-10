"use client";

import { useQuery } from "@tanstack/react-query";
import { SuspensePagination } from "@/app/components/pagination/SuspensePagination";
import { getTaskList, UploadLargeXlsxToDatabaseQK } from "../api";
import { useSocketEnhancement } from "../socket/hooks";
import { isActiveStatus, type Task } from "../types";
import { ActiveTaskCard } from "./ActiveTaskCard";
import { CompletedTaskCard } from "./CompletedTaskCard";

export const Tasks = () => {
  const tasksQuery = useQuery({
    queryKey: [UploadLargeXlsxToDatabaseQK.GET_TASKS],
    queryFn: () => getTaskList(1),
    refetchInterval: (query) => {
      /* Smart polling: only poll if there are active tasks */
      const hasActiveTasks = query.state.data?.some((task: Task) =>
        isActiveStatus(task.status),
      );
      /* 5s if has active, 30s for all static */
      return hasActiveTasks ? 5000 : 30000;
    },
    refetchIntervalInBackground: false,
  });

  /* Enhance with real-time Socket.io updates */
  const { connectionState, isConnected } = useSocketEnhancement(
    tasksQuery.data || [],
  );

  if (tasksQuery.isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-48 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (tasksQuery.error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Tasks</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading tasks: {(tasksQuery.error as Error).message}
        </div>
      </div>
    );
  }

  const tasks = tasksQuery.data || [];

  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Tasks ({tasks.length})
        </h2>
        {/* Real-time connection status indicator */}
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? "bg-green-500"
                : connectionState.reconnecting
                  ? "bg-yellow-500"
                  : "bg-gray-500"
            }`}
          ></div>
          <span className="text-gray-600">
            {isConnected
              ? "Real-time"
              : connectionState.reconnecting
                ? "Reconnecting..."
                : "Offline"}
          </span>
        </div>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No tasks found</div>
          <div className="text-gray-500 text-sm">
            Create your first task to get started
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            const isActive = isActiveStatus(task.status);
            return isActive ? (
              <ActiveTaskCard key={task.id} task={task} />
            ) : (
              <CompletedTaskCard key={task.id} task={task} />
            );
          })}
        </div>
      )}

      <SuspensePagination
        /* Simplified logic, could be enhanced with actual pagination info */
        hasNextPage={tasks.length > 0}
        hasPreviousPage={true}
      />
    </div>
  );
};
