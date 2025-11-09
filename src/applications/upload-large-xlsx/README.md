# Upload Large XLSX

This module handles large XLSX file uploads with background processing using Bull queues and provides real-time progress updates via Socket.IO WebSocket gateway. The implementation uses a simplified single-processor architecture with Redis for temporary file storage and Zod for type-safe validation.

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

-   **processors/file-processing.processor.ts** - Single processor handling entire workflow (loading, validation, saving)

### Supporting Files

-   **dto/create-upload-large-xlsx.dto.ts** - Data transfer objects
-   **swagger/upload-large-xlsx.swagger.ts** - Swagger API documentation configuration

## API Endpoints

-   `POST /applications/upload-large-xlsx/upload` - Upload XLSX file
-   `GET /applications/upload-large-xlsx/tasks` - Get all tasks
-   `GET /applications/upload-large-xlsx/tasks/:taskId` - Get specific task by ID
-   `DELETE /applications/upload-large-xlsx/delete-data-by-task-id/:taskId` - Delete task and associated data

## Bull Queue Architecture

### Single Processor Design

The module uses a **simplified single-processor architecture** that eliminates race conditions and complexity:

### FileProcessingProcessor (upload-xlsx-processing queue)

**Linear Processing Flow:**

1. **File Loading** - Retrieves file from Redis storage using fileKey
2. **Header Validation** - Validates worksheet headers (Name, Gender, Bio-ID)
3. **Data Validation** - Processes rows in batches using Zod schema validation
4. **Data Saving** - Saves valid data to database in batches
5. **Cleanup & Completion** - Updates task status and cleans up Redis storage

**Key Features:**

-   **Atomic Processing** - Single job handles entire workflow
-   **Progress Tracking** - Real-time progress updates (0-100%)
-   **Error Handling** - Comprehensive error collection and reporting
-   **Redis Integration** - Temporary file storage with automatic TTL cleanup
-   **Zod Validation** - Type-safe data validation with detailed error messages

## Job Flow

1. **File Upload** → `UploadLargeXlsxService.uploadXlsx()` stores file in Redis and creates task with PENDING status
2. **Job Queuing** → `BullQueueService.addFileProcessingJob()` queues single processing job
3. **Background Processing** → `FileProcessingProcessor.process()` handles entire workflow:
    - **Phase 1 (0-10%):** Load workbook from Redis storage
    - **Phase 2 (10-20%):** Validate headers and extract data structure
    - **Phase 3 (20-50%):** Validate data rows using Zod schemas
    - **Phase 4 (50-100%):** Save valid data to database in batches
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
3. **LOADING_WORKBOOK** → `task-progress` event (0-10% progress)
4. **VALIDATING_HEADERS** → `task-progress` event (10-20% progress)
5. **VALIDATING** → `task-progress` events (20-50% progress) with row validation details
6. **SAVING** → `task-progress` events (50-100% progress) with saving details
7. **COMPLETED/HAS_ERRORS/FAILED** → Final `task-completed` or `task-failed` event

## Architecture Benefits

### Simplified Design

-   **Single Processor** - One job handles entire workflow (vs. 3 separate processors)
-   **Linear Processing** - No complex inter-job coordination
-   **Atomic Operations** - Clear transaction boundaries

### Eliminated Race Conditions

-   **No "Last Chunk" Detection** - Single job knows when it's done
-   **No Parallel Database Updates** - Sequential status updates
-   **No Redis Counter Conflicts** - Single job tracks all metrics

### Better Reliability

-   **Job Persistence** - Bull jobs survive server restarts
-   **Automatic Retries** - Failed jobs retry with exponential backoff
-   **Unique Job IDs** - Prevents duplicate processing of same task

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

1. **Single Responsibility** - One job, one complete workflow
2. **Idempotent Operations** - Jobs can be safely retried
3. **Graceful Degradation** - Failures don't corrupt partial data
4. **Comprehensive Logging** - Full audit trail of processing
5. **Resource Cleanup** - Automatic Redis and job cleanup
6. **Type Safety** - Zod validation prevents runtime type errors
