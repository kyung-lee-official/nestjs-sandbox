# Upload Large XLSX

This module handles large XLSX file uploads with background processing using Bull queues and provides real-time progress updates via Socket.IO WebSocket gateway. The implementation uses a three-processor architecture with Redis for temporary file storage and Zod for type-safe validation.

## Module Structure

### Core Files

-   **upload-large-xlsx.module.ts** - Main module configuration with Bull queue and services
-   **upload-large-xlsx.controller.ts** - REST API endpoints for file upload and task management
-   **upload-large-xlsx.service.ts** - Business logic for file upload, Redis storage, and Bull job queuing
-   **upload-large-xlsx.gateway.ts** - Socket.IO WebSocket gateway for real-time progress updates
-   **types.ts** - Zod schemas and TypeScript type definitions

### Services

-   **services/bull-queue.service.ts** - Bull queue management and job processing coordination
-   **services/redis-storage.service.ts** - Redis-based temporary file storage with TTL

### Processing System

-   **processors/file-processing.processor.ts** - Main orchestrator processor (coordinates loading, header validation, and delegates to specialized processors)
-   **processors/validating.processor.ts** - Specialized processor for data row validation with real-time progress (0-100%)
-   **processors/saving.processor.ts** - Specialized processor for database saving with real-time progress (0-100%)

### Supporting Files

-   **dto/create-upload-large-xlsx.dto.ts** - Data transfer objects
-   **swagger/upload-large-xlsx.swagger.ts** - Swagger API documentation configuration

## API Endpoints

-   `POST /applications/upload-large-xlsx/upload` - Upload XLSX file
-   `GET /applications/upload-large-xlsx/tasks` - Get all tasks
-   `GET /applications/upload-large-xlsx/tasks/:taskId` - Get specific task by ID
-   `DELETE /applications/upload-large-xlsx/delete-data-by-task-id/:taskId` - Delete task and associated data

## Bull Queue Architecture

### Three-Processor Design

The module uses a **three-processor architecture** with specialized processors for different phases while maintaining atomic job processing:

### FileProcessingProcessor (Main Orchestrator)

**Orchestration Flow:**

1. **File Loading** - Retrieves file from Redis storage using fileKey
2. **Header Validation** - Validates worksheet headers (Name, Gender, Bio-ID)
3. **Data Validation** - Delegates to ValidatingProcessor for row validation
4. **Data Saving** - Delegates to SavingProcessor for database operations
5. **Cleanup & Completion** - Updates task status and cleans up Redis storage

### ValidatingProcessor (Data Validation)

**Specialized for row validation with real-time progress:**

-   Processes worksheet rows in batches (1000 rows per batch)
-   Uses Zod schema validation for type safety
-   Emits progress updates (0-100%) for VALIDATING phase only
-   Updates Bull job progress (20-50% range for overall job)
-   Collects validation errors with detailed messages

### SavingProcessor (Database Operations)

**Specialized for database saving with real-time progress:**

-   Saves valid data to database in batches (1000 rows per batch)
-   Emits progress updates (0-100%) for SAVING phase only
-   Updates Bull job progress (50-100% range for overall job)
-   Handles database transactions and error recovery

**Key Features:**

-   **Atomic Processing** - Single Bull job coordinates all processors
-   **Phase-Specific Progress** - Each processor has independent 0-100% progress
-   **Specialized Responsibilities** - Clear separation of concerns
-   **Error Handling** - Comprehensive error collection and reporting
-   **Redis Integration** - Temporary file storage with automatic TTL cleanup
-   **Zod Validation** - Type-safe data validation with detailed error messages

## Job Flow

1. **File Upload** → `UploadLargeXlsxService.uploadXlsx()` stores file in Redis and creates task with PENDING status
2. **Job Queuing** → `BullQueueService.addFileProcessingJob()` queues single processing job
3. **Background Processing** → `FileProcessingProcessor.process()` orchestrates specialized processors:
    - **Phase 1:** Load workbook from Redis storage (status update only)
    - **Phase 2:** Validate headers and extract data structure (status update only)
    - **Phase 3:** Delegate to `ValidatingProcessor` - validates data rows with real-time progress (0-100%)
    - **Phase 4:** Delegate to `SavingProcessor` - saves valid data to database with real-time progress (0-100%)
4. **Real-time Updates** → Gateway emits progress updates throughout the entire process
5. **Cleanup** → Automatic Redis file cleanup and task completion

## Socket.IO Gateway Lifecycle

The `UploadLargeXlsxGateway` provides real-time WebSocket communication for task progress tracking.

### Gateway Configuration

```typescript
@WebSocketGateway({
  cors: { origin: "*" },
  namespace: "/upload-xlsx"
})
```

### Lifecycle Events

#### 1. Gateway Initialization

-   **Event**: `afterInit(server: Server)`
-   **Trigger**: When NestJS application starts up
-   **Purpose**: Initialize WebSocket server and logging

#### 2. Client Connection Management

-   **Event**: `handleConnection(client: Socket)`
-   **Trigger**: When client connects to `/upload-xlsx` namespace
-   **Purpose**: Log new client connections and prepare for task subscriptions

-   **Event**: `handleDisconnect(client: Socket)`
-   **Trigger**: When client disconnects (tab close, network issue, etc.)
-   **Purpose**: Clean up client connections and room memberships

#### 3. Room-Based Task Subscription

-   **Event**: `@SubscribeMessage("join-task")`
-   **Trigger**: Client sends `join-task` message with `{taskId: number}`
-   **Purpose**: Subscribe client to specific task updates via room `task-${taskId}`

-   **Event**: `@SubscribeMessage("leave-task")`
-   **Trigger**: Client sends `leave-task` message with `{taskId: number}`
-   **Purpose**: Unsubscribe client from task updates

#### 4. Progress Broadcasting Methods

Called by `FileProcessingProcessor` to emit real-time updates:

-   **`emitTaskProgress(taskId, progressData)`** - Real-time progress updates with phase and percentage
-   **`emitTaskCompleted(taskId, completionResult)`** - Task completion with final statistics
-   **`emitTaskFailed(taskId, error)`** - Task failure notification

**Legacy Methods** (kept for compatibility):

-   **`emitWorkbookLoadingStatus(taskId)`** - Workbook loading phase
-   **`emitHeaderValidationStatus(taskId)`** - Header validation phase
-   **`emitProcessingCompleted(taskId, totalRows)`** - Processing completion

### Client Integration Example

```javascript
const socket = io("/upload-xlsx");
socket.emit("join-task", { taskId: 123 });
socket.on("task-progress", (data) => {
	console.log("Progress:", data.validationProgress, data.savingProgress);
});
socket.on("task-completed", (data) => {
	console.log("Task completed:", data);
});
```

### Task Status Flow via WebSocket

1. **PENDING** → Task created, file stored in Redis, job queued
2. **PROCESSING** → Job picked up by Bull worker
3. **LOADING_WORKBOOK** → `task-progress` event (status only, no progress percentage)
4. **VALIDATING_HEADERS** → `task-progress` event (status only, no progress percentage)
5. **VALIDATING** → `task-progress` events (0-100% progress) with row validation details from ValidatingProcessor
6. **SAVING** → `task-progress` events (0-100% progress) with saving details from SavingProcessor
7. **COMPLETED/HAS_ERRORS/FAILED** → Final `task-completed` or `task-failed` event

## Architecture Benefits

### Specialized Design

-   **Three Processors** - Orchestrator coordinates specialized ValidatingProcessor and SavingProcessor
-   **Linear Processing** - Single Bull job coordinates all processors sequentially
-   **Atomic Operations** - Clear transaction boundaries within single job
-   **Phase-Specific Progress** - Each processor reports independent 0-100% progress

### Eliminated Race Conditions

-   **Single Job Coordination** - One Bull job orchestrates all processors
-   **Sequential Processing** - No parallel database updates within same task
-   **No Redis Counter Conflicts** - Single job tracks all metrics
-   **Independent Progress Tracking** - Each phase has its own progress percentage

### Better Reliability

-   **Job Persistence** - Bull jobs survive server restarts
-   **Automatic Retries** - Failed jobs retry with exponential backoff
-   **Unique Job IDs** - Prevents duplicate processing of same task
-   **Specialized Error Handling** - Each processor handles its specific error cases

## Data Flow and Storage

### Redis Temporary File Storage

```typescript
/* File storage workflow */
1. Upload → Store file buffer in Redis with TTL (1 hour)
2. Queue job with fileKey reference
3. Process → Retrieve file buffer from Redis
4. Cleanup → Delete file from Redis after processing/failure
```

**Benefits:**

-   **Memory Efficient** - Files stored in Redis, not in job data
-   **Automatic Cleanup** - TTL prevents orphaned files
-   **Scalable** - Multiple worker instances can access same Redis

### Zod Schema Validation

```typescript
/* Type-safe validation throughout */
export const UploadLargeXlsxRowDataSchema = z.object({
	name: z.string().min(1, "Name is required"),
	gender: z.string().min(1, "Gender is required"),
	bioId: z.string().min(1, "Bio ID is required"),
});

/* All types inferred from schemas */
export type UploadLargeXlsxRowData = z.infer<
	typeof UploadLargeXlsxRowDataSchema
>;
```

**Benefits:**

-   **Runtime Validation** - Catch invalid data with descriptive errors
-   **Type Safety** - TypeScript types automatically inferred
-   **Consistent Schemas** - Single source of truth for data structure

## Error Handling and Recovery

### Bull Queue Resilience

```typescript
defaultJobOptions: {
    removeOnComplete: 10, /* Keep recent jobs for debugging */
    removeOnFail: 50, /* Keep failed jobs for analysis */
    attempts: 3, /* Retry failed jobs up to 3 times */
    backoff: { type: 'exponential', delay: 2000 }
}
```

### Job Failure Recovery

1. **Temporary Failures** - Bull retries with exponential backoff
2. **File Not Found** - Job fails gracefully, task marked as FAILED
3. **Database Errors** - Transaction rollback, detailed error logging
4. **Validation Errors** - Collected and saved for user review

### Progress Tracking Safety

-   **Atomic Progress Updates** - Single job updates its own progress
-   **WebSocket Resilience** - Failed emissions don't crash processing
-   **Database Consistency** - Final counts always match processed data

## Best Practices Implemented

1. **Single Responsibility** - Each processor has a specific role (orchestration, validation, saving)
2. **Atomic Job Processing** - One Bull job coordinates all processors for complete workflow
3. **Idempotent Operations** - Jobs can be safely retried
4. **Phase-Specific Progress** - Independent 0-100% progress tracking per processor
5. **Graceful Degradation** - Failures don't corrupt partial data
6. **Comprehensive Logging** - Full audit trail with processor-specific error handling
7. **Resource Cleanup** - Automatic Redis and job cleanup
8. **Type Safety** - Zod validation prevents runtime type errors
9. **Real-time Updates** - Status-only notifications for quick phases, detailed progress for long phases

# Frontend Integration Best Practices

## 🎯 Hybrid Strategy Overview

The key is to use **HTTP for state management** and **Socket.IO for real-time updates** - don't rely on WebSocket alone for data consistency.

## Frontend Integration Flow Chart

### 📤 **Layer 1: File Upload & Task Creation**

-   🚀 **User Action**: User selects and uploads Excel file
-   📡 **HTTP Request**: `POST /upload-xlsx/upload`
-   💾 **Backend**: Task created in database with `PENDING` status
-   📨 **Response**: Frontend receives task ID and file metadata

### 📊 **Layer 2: Initial Data Loading**

-   ⚛️ **React Query**: Start query for task list
-   📡 **HTTP Request**: `GET /upload-xlsx/tasks` - Authoritative data source
-   🎨 **UI Update**: Display task list with loading indicators
-   🔄 **Query Setup**: Configure refetch intervals and caching

### 🔌 **Layer 3: Real-time Connection Decision**

```
IF active tasks exist (PENDING/PROCESSING):
  ├── 🟢 Connect to Socket.IO namespace `/upload-xlsx`
  ├── 📡 Join task rooms: `task-{taskId}`
  └── 🎯 Subscribe to progress events
ELSE:
  └── 📊 Use HTTP polling only (30s intervals)
```

### ⚡ **Layer 4: Real-time Processing Updates**

-   **📂 Phase 1: LOADING_WORKBOOK** (Status Only)

    -   📡 Socket Event: `task-progress` → `{ taskId, phase: "LOADING_WORKBOOK" }`
    -   🎨 Frontend: Show status without progress percentage
    -   💭 Status: "Reading Excel file..."

-   **📋 Phase 2: VALIDATING_HEADERS** (Status Only)

    -   📡 Socket Event: `task-progress` → `{ taskId, phase: "VALIDATING_HEADERS" }`
    -   🎨 Frontend: Show status without progress percentage
    -   💭 Status: "Validating column headers..."

-   **✅ Phase 3: VALIDATING** (0% → 100%)

    -   📡 Socket Events: Multiple `task-progress` updates from ValidatingProcessor
    -   📊 Data: `{ phase: "VALIDATING", progress: 25, totalRows: 1000, validatedRows: 250, errorRows: 5 }`
    -   🎨 Frontend: Dynamic progress bar (0-100%) + row counters
    -   💭 Status: "Validating row 250 of 1000... (25%)"

-   **💾 Phase 4: SAVING** (0% → 100%)
    -   📡 Socket Events: Multiple `task-progress` updates from SavingProcessor
    -   📊 Data: `{ phase: "SAVING", progress: 85, savedRows: 850 }`
    -   🎨 Frontend: Dynamic progress bar (0-100%) + saved row counter
    -   💭 Status: "Saving data... (85%)"
    -   🎨 Frontend: Update progress bar to 85%
    -   💭 Status: "Saving validated data..."

### 🎯 **Layer 5: Completion Handling**

```
ON task completion:
├── 🟢 SUCCESS Path:
│   ├── 📡 Socket Event: `task-completed` → { taskId, status: "COMPLETED", savedRows: 995 }
│   ├── 🔄 Refresh Data: HTTP GET /tasks to get latest state
│   └── 🎨 UI: Show "Download Results" button
│
└── 🔴 ERROR Path:
    ├── 📡 Socket Event: `task-failed` → { taskId, error: "Processing failed" }
    ├── 🔄 Refresh Data: HTTP GET /tasks for error details
    └── 🎨 UI: Show "Retry" and error message
```

### 🛡️ **Layer 6: Connection Resilience**

-   **🔌 Connection Lost**:

    -   📡 Socket.IO disconnect event detected
    -   🔄 Fallback: Switch to aggressive HTTP polling (5s intervals)
    -   🎨 UI: Show "Reconnecting..." indicator
    -   📊 Continue displaying last known progress state

-   **🔌 Connection Restored**:
    -   📡 Socket.IO reconnect event detected
    -   🔄 Re-sync: Immediate HTTP GET /tasks to catch missed updates
    -   📡 Re-subscribe: Rejoin active task rooms
    -   🎨 UI: Hide reconnection indicator
    -   ⏰ Restore normal HTTP polling intervals (30s)

### 🧹 **Layer 7: Cleanup & Resource Management**

-   **📤 Task Completion**: Leave socket rooms for completed tasks
-   **🔄 Subscription Management**: Only join rooms for active tasks
-   **💾 Cache Management**: Invalidate stale React Query data
-   **🎨 UI State**: Update task cards to show final actions (Download/Retry/Delete)

### Key Integration Points:

1. **🔄 Dual Data Sources**: HTTP for reliability, Socket.IO for real-time updates
2. **⚡ Smart Subscriptions**: Only join socket rooms for active tasks
3. **🛡️ Fallback Strategy**: Auto-switch to HTTP polling on connection loss
4. **🎯 State Synchronization**: Periodic HTTP sync ensures data consistency
5. **🎨 UI Responsiveness**: Real-time progress updates with consistent data fetching

## Data Management Architecture

### Primary Data Source: HTTP + TanStack Query

```typescript
/* Main task list - authoritative source */
const { data: tasks, refetch } = useQuery({
	queryKey: ["upload-tasks"],
	queryFn: () => api.getTasks(),
	refetchInterval: 30000 /* Fallback polling every 30s */,
	staleTime: 10000 /* Consider data stale after 10s */,
});
```

### Real-time Updates: Socket.IO Enhancement

```typescript
/* WebSocket enhances but doesn't replace HTTP data */
useEffect(() => {
	socket.on("task-progress", (data) => {
		/* Update specific task in cache without full refetch */
		queryClient.setQueryData(["upload-tasks"], (old) =>
			old?.map((task) =>
					? { ...task, ...data, updatedAt: new Date() }
					: task
			)
		);
	});
}, []);
```

## 🔄 Smart Hybrid Strategy

### 1. Initial Load Strategy

```typescript
/* Always start with HTTP - reliable baseline */
const TaskList = () => {
  const { data: tasks, isLoading } = useQuery(['upload-tasks'], fetchTasks)

  /* Then enhance with real-time updates */
  useSocketEnhancement(tasks)

  return <TaskGrid tasks={tasks} loading={isLoading} />
}
```

### 2. Real-time Enhancement Strategy

```typescript
const useSocketEnhancement = (tasks) => {
	const queryClient = useQueryClient();

	useEffect(() => {
		/* Only subscribe to active tasks */
		const activeTasks = tasks?.filter(isActiveTask) || [];

		activeTasks.forEach((task) => {
			socket.emit("join-task", { taskId: task.id });
		});

		/* Update progress in real-time */
		socket.on("task-progress", updateTaskProgress);
		socket.on("task-completed", handleTaskCompletion);
		socket.on("task-failed", handleTaskFailure);

		return () => {
			activeTasks.forEach((task) => {
				socket.emit("leave-task", { taskId: task.id });
			});
		};
	}, [
		tasks?.map((t) => t.id).join(","),
	]); /* Re-subscribe when task list changes */
};
```

### 3. State Synchronization Strategy

```typescript
const handleTaskCompletion = (completionData) => {
	/* Refresh data to get latest state from server */
	queryClient.invalidateQueries(["upload-tasks"]);
};
```

## 📡 Socket.IO Connection Management

### Connection Strategy

```typescript
/* Lazy connection - only when needed */
const useSocketConnection = () => {
	const [socket, setSocket] = useState(null);

	const connect = useCallback(() => {
		if (!socket?.connected) {
			const newSocket = io("/upload-xlsx");
			setSocket(newSocket);
		}
	}, [socket]);

	/* Connect when there are active tasks */
	const hasActiveTasks = tasks?.some(isActiveTask);
	useEffect(() => {
		if (hasActiveTasks) connect();
		else socket?.disconnect();
	}, [hasActiveTasks]);
};
```

### Resilience Strategy

```typescript
/* Handle connection failures gracefully */
socket.on("disconnect", () => {
	/* Fall back to HTTP polling for active tasks */
	const activeTasks = queryClient
		.getQueryData(["upload-tasks"])
		?.filter(isActiveTask);

	if (activeTasks?.length > 0) {
		/* Increase polling frequency temporarily */
		queryClient.setQueryDefaults(["upload-tasks"], {
			refetchInterval: 5000 /* Poll every 5s when disconnected */,
		});
	}
});

socket.on("reconnect", () => {
	/* Restore normal polling */
	queryClient.setQueryDefaults(["upload-tasks"], {
		refetchInterval: 30000,
	});

	/* Re-fetch to sync any missed updates */
	queryClient.invalidateQueries(["upload-tasks"]);
});
```

## 🎨 UI State Management

### Task Status Classification

```typescript
const isActiveTask = (task) => ['PENDING', 'PROCESSING'].includes(task.status)
const isTerminalTask = (task) => ['COMPLETED', 'HAS_ERRORS', 'FAILED'].includes(task.status)

/* Separate rendering logic by state */
const TaskCard = ({ task }) => {
  if (isActiveTask(task)) {
    return <ActiveTaskCard task={task} /> /* Shows progress, real-time updates */
  }
  return <CompletedTaskCard task={task} /> /* Shows final results, static */
}
```

### Progress State Management

```typescript
/* Local progress state enhanced by WebSocket */
const useTaskProgress = (task) => {
	const [progress, setProgress] = useState({
		phase: task.detailedStatus || "PENDING",
		percentage: 0,
		metrics: { validatedRows: 0, errorRows: 0, savedRows: 0 },
	});

	/* Update from WebSocket events */
	useEffect(() => {
		const handleProgress = (data) => {
			if (data.taskId === task.id) {
				setProgress((prev) => ({ ...prev, ...data }));
			}
		};

		socket?.on("task-progress", handleProgress);
		return () => socket?.off("task-progress", handleProgress);
	}, [task.id]);

	return progress;
};
```

## ⚡ Performance Optimizations

### Selective Subscriptions

```typescript
/* Only subscribe to tasks that need real-time updates */
const useSelectiveSubscriptions = (tasks) => {
	const activeTasks = useMemo(
		() => tasks?.filter(isActiveTask) || [],
		[tasks]
	);

	/* Subscribe/unsubscribe efficiently */
	useEffect(() => {
		const taskIds = activeTasks.map((t) => t.id);

		/* Join new tasks */
		taskIds.forEach((id) => {
			if (!subscribedTasks.has(id)) {
				socket.emit("join-task", { taskId: id });
				subscribedTasks.add(id);
			}
		});

		/* Leave old tasks */
		subscribedTasks.forEach((id) => {
			if (!taskIds.includes(id)) {
				socket.emit("leave-task", { taskId: id });
				subscribedTasks.delete(id);
			}
		});
	}, [activeTasks.map((t) => t.id).join(",")]);
};
```

### Debounced Updates

```typescript
/* Prevent UI thrashing from rapid WebSocket updates */
const useDebouncedProgress = (rawProgress) => {
	const [debouncedProgress, setDebouncedProgress] = useState(rawProgress);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedProgress(rawProgress);
		}, 100); /* Update UI max every 100ms */

		return () => clearTimeout(timer);
	}, [rawProgress]);

	return debouncedProgress;
};
```

## 🔄 Data Consistency Patterns

### Server-First Updates

```typescript
const uploadFile = useMutation({
	mutationFn: api.uploadFile,
	onSuccess: (response) => {
		/* Refresh task list to get server state */
		queryClient.invalidateQueries(["upload-tasks"]);
	},
	onError: (error) => {
		/* Show error message, refresh to get consistent state */
		queryClient.invalidateQueries(["upload-tasks"]);
	},
});
```

### Conflict Resolution Strategy

```typescript
/* Handle conflicts between HTTP and WebSocket data */
const mergeTaskData = (httpTask, socketUpdate) => {
	return {
		...httpTask,
		...socketUpdate,
		/* HTTP data takes precedence for critical fields */
		id: httpTask.id,
		createdAt: httpTask.createdAt,
		/* WebSocket data enhances with real-time info */
		progress: socketUpdate.progress ?? httpTask.progress,
		updatedAt: new Date() /* Mark as recently updated */,
	};
};
```

## 🎯 Frontend Architecture Benefits

### Reliability

-   **HTTP as Source of Truth** - Always have consistent baseline data
-   **WebSocket as Enhancement** - Real-time updates improve UX but aren't critical
-   **Graceful Degradation** - Works even if WebSocket fails

### Performance

-   **Selective Real-time** - Only active tasks get WebSocket updates
-   **Smart Polling** - Reduced HTTP requests when WebSocket works
-   **Debounced Updates** - Smooth UI without thrashing

### User Experience

-   **Server-Consistent State** - Always fetch latest data from server
-   **Real-time Progress** - Live progress bars for active tasks
-   **Consistent State** - No confusion between different data sources

**This hybrid approach gives you the best of both worlds: reliable data consistency from HTTP and smooth real-time UX from WebSockets! 🚀**
