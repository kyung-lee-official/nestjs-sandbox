import { type DbTaskStatus, type Task, TerminalStatusesSchema } from "../types";
import { Delete } from "./Delete";
import { DownloadErrors } from "./DownloadErrors";

type CompletedTaskCardProps = {
  task: Task;
};

/* CompletedTaskCard - Optimized for completed tasks */
export const CompletedTaskCard = ({ task }: CompletedTaskCardProps) => {
  const {
    id,
    status,
    totalRows,
    validatedRows,
    savedRows,
    errorRows,
    createdAt,
    updatedAt,
  } = task;

  const getStatusColor = (status: DbTaskStatus) => {
    switch (status) {
      case TerminalStatusesSchema.enum.COMPLETED:
        return "bg-green-100 text-green-700 border-green-300";
      case TerminalStatusesSchema.enum.HAS_ERRORS:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case TerminalStatusesSchema.enum.FAILED:
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getBorderColor = (status: DbTaskStatus) => {
    switch (status) {
      case TerminalStatusesSchema.enum.COMPLETED:
        return "border-l-green-500";
      case TerminalStatusesSchema.enum.HAS_ERRORS:
        return "border-l-yellow-500";
      case TerminalStatusesSchema.enum.FAILED:
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const successRate =
    totalRows > 0 ? Math.round((savedRows / totalRows) * 100) : 0;

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getBorderColor(
        status,
      )} hover:shadow-lg transition-shadow`}
    >
      {/* Header with status and actions */}
      <div className="flex justify-between items-start mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            status,
          )}`}
        >
          {status}
        </span>
        <div className="flex items-center gap-2">
          <Delete taskId={id.toString()} />
        </div>
      </div>
      <DownloadErrors task={task} />

      {/* Success Rate for completed tasks */}
      {status === TerminalStatusesSchema.enum.COMPLETED && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Success Rate
            </span>
            <span className="text-green-600 font-semibold">{successRate}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${successRate}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Detailed Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center bg-gray-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-gray-900">
            {totalRows.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Total Rows</div>
        </div>
        <div className="text-center bg-green-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-green-600">
            {savedRows.toLocaleString()}
          </div>
          <div className="text-xs text-green-500">Saved</div>
        </div>
        {errorRows > 0 && (
          <>
            <div className="text-center bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-blue-600">
                {validatedRows.toLocaleString()}
              </div>
              <div className="text-xs text-blue-500">Validated</div>
            </div>
            <div className="text-center bg-red-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-red-600">
                {errorRows.toLocaleString()}
              </div>
              <div className="text-xs text-red-500">Errors</div>
            </div>
          </>
        )}
      </div>

      {/* Task Summary */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>Task ID:</span>
          <span>{id}</span>
        </div>
        <div className="flex justify-between">
          <span>Completed:</span>
          <span>{formatDate(updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};
