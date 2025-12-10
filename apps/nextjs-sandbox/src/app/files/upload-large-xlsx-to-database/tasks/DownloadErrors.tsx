"use client";

import { useMutation } from "@tanstack/react-query";
import { downloadTaskErrors } from "../api";
import { type Task, TerminalStatusesSchema } from "../types";

type DownloadErrorsProps = {
  task: Task;
};

export const DownloadErrors = ({ task }: DownloadErrorsProps) => {
  const downloadErrorsMutation = useMutation({
    mutationFn: (taskId: number) => downloadTaskErrors(taskId),
    onSuccess: (data: ArrayBuffer) => {
      /* Convert ArrayBuffer to Blob */
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      /* Create download URL */
      const url = window.URL.createObjectURL(blob);

      /* Create and trigger download */
      const link = document.createElement("a");
      link.href = url;
      link.download = `task-${task.id}-errors.xlsx`;
      document.body.appendChild(link);
      link.click();

      /* Cleanup */
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("Failed to download errors:", error);
      /* You might want to show a toast notification here */
    },
  });

  /* Only show the button if the task has errors */
  if (task.status !== TerminalStatusesSchema.enum.HAS_ERRORS) {
    return null;
  }

  return (
    <button
      onClick={() => downloadErrorsMutation.mutate(task.id)}
      disabled={downloadErrorsMutation.isPending}
      className="inline-flex items-center gap-2 px-3 py-2 mb-4
			text-white text-xs
			bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 
			rounded-md transition-colors duration-200"
      title="Download error report as Excel file"
    >
      {downloadErrorsMutation.isPending ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Downloading...
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download Errors
        </>
      )}
    </button>
  );
};
