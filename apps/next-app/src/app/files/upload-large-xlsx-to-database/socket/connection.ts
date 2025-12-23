import { useCallback, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { UploadLargeXlsxToDatabaseQK } from "../api";
import {
  ActiveStatusesSchema,
  type SocketConnectionState,
  type Task,
  type UseSocketConnectionReturn,
} from "../types";

/* Lazy connection - only when needed */
export const useSocketConnection = (): UseSocketConnectionReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionState, setConnectionState] = useState<SocketConnectionState>(
    {
      connected: false,
      reconnecting: false,
    },
  );

  const connect = useCallback(() => {
    setSocket((currentSocket) => {
      if (currentSocket?.connected) {
        return currentSocket; // Already connected, no change needed
      }

      const newSocket = io(`${process.env.NEXT_PUBLIC_NESTJS}/upload-xlsx`);

      /* Update connection state */
      newSocket.on("connect", () => {
        setConnectionState({
          connected: true,
          reconnecting: false,
        });
      });

      /* Handle connection failures gracefully */
      newSocket.on("disconnect", () => {
        setConnectionState({
          connected: false,
          reconnecting: false,
        });

        /* Fall back to HTTP polling for active tasks */
        const tasks = queryClient.getQueryData([
          UploadLargeXlsxToDatabaseQK.GET_TASKS,
        ]) as Task[] | undefined;
        const activeTasks = tasks?.filter(
          (task: Task) =>
            task.status === ActiveStatusesSchema.enum.PENDING ||
            task.status === ActiveStatusesSchema.enum.PROCESSING,
        );

        if (activeTasks && activeTasks.length > 0) {
          /* Increase polling frequency temporarily */
          queryClient.setQueryDefaults(
            [UploadLargeXlsxToDatabaseQK.GET_TASKS],
            {
              refetchInterval: 5000 /* Poll every 5s when disconnected */,
            },
          );
        }
      });

      newSocket.on("reconnect", () => {
        setConnectionState((prev) => ({
          ...prev,
          reconnecting: false,
        }));

        /* Restore normal polling */
        queryClient.setQueryDefaults([UploadLargeXlsxToDatabaseQK.GET_TASKS], {
          refetchInterval: 30000,
        });

        /* Re-fetch to sync any missed updates */
        queryClient.invalidateQueries({
          queryKey: [UploadLargeXlsxToDatabaseQK.GET_TASKS],
        });
      });

      newSocket.on("reconnect_attempt", () => {
        setConnectionState((prev) => ({
          ...prev,
          reconnecting: true,
        }));
      });

      newSocket.on("connect_error", (error) => {
        setConnectionState((prev) => ({
          ...prev,
          error: error.message,
        }));
      });

      return newSocket;
    });
  }, []); // Remove socket dependency to prevent infinite loop

  const disconnect = useCallback(() => {
    setSocket((currentSocket) => {
      if (currentSocket?.connected) {
        currentSocket.disconnect();
        setConnectionState({
          connected: false,
          reconnecting: false,
        });
      }
      return null;
    });
  }, []); // Remove socket dependency to prevent infinite loop

  return {
    socket,
    connectionState,
    connect,
    disconnect,
  };
};
