import {
  ActiveStatusesSchema,
  type DbTaskStatus,
  isActiveStatus,
  RedisProgressStatus,
  RedisProgressStatusSchema,
  type Task,
  type TaskWithProgress,
} from "../types";

type StatusProps = {
  task: TaskWithProgress;
};

const Status = (props: StatusProps) => {
  const { task } = props;
  const { status } = task;

  const getStatusColor = (status: DbTaskStatus) => {
    switch (status) {
      case ActiveStatusesSchema.enum.PENDING:
        return "bg-blue-100 text-blue-700 border-blue-300";
      case ActiveStatusesSchema.enum.PROCESSING:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            status,
          )}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

type PhaseProps = {
  task: TaskWithProgress;
};

const Phase = (props: PhaseProps) => {
  const { task } = props;
  const { phase, progress } = task;
  if (!phase) return null;
  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        {phase === RedisProgressStatusSchema.enum.LOADING_WORKBOOK
          ? "Loading Workbook"
          : phase === RedisProgressStatusSchema.enum.VALIDATING_HEADERS
            ? "Validating Headers"
            : phase === RedisProgressStatusSchema.enum.VALIDATING
              ? "Validating Data"
              : phase === RedisProgressStatusSchema.enum.SAVING
                ? "Saving Data"
                : phase}{" "}
        ...
      </div>
      {progress && (
        <div className="text-blue-600 font-semibold">
          {progress.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

const ProgressBar = (props: { progress: number }) => {
  const { progress } = props;
  return (
    <div className="bg-gray-200 rounded-full h-3">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      >
        <div className="h-full w-full rounded-full bg-gradient-to-r from-transparent to-white opacity-30"></div>
      </div>
    </div>
  );
};

type ActiveTaskCardProps = {
  task: Task;
};

/* ActiveTaskCard - Optimized for tasks in progress */
export const ActiveTaskCard = ({ task }: ActiveTaskCardProps) => {
  const { id, progress, createdAt } = task as TaskWithProgress;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
      <Status task={task as TaskWithProgress} />
      {/* Live Progress Bar */}
      <div className="mb-4">
        <Phase task={task as TaskWithProgress} />
        {progress && <ProgressBar progress={progress || 0} />}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center bg-blue-50 rounded-lg p-3">
          <div className="text-xl font-bold text-blue-600">
            {/* {totalRows.toLocaleString()} */}
          </div>
          <div className="text-xs text-blue-500 font-medium">Total Rows</div>
        </div>
        <div className="text-center bg-green-50 rounded-lg p-3">
          <div className="text-xl font-bold text-green-600">
            {/* {validatedRows.toLocaleString()} */}
          </div>
          <div className="text-xs text-green-500 font-medium">Validated</div>
        </div>
      </div>

      {/* Real-time indicators */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Task ID: {id}</span>
        <span>Started: {formatDate(createdAt)}</span>
      </div>
    </div>
  );
};
