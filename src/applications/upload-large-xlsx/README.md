# Upload Large XLSX

This module handles large XLSX file uploads with background processing using BullMQ queues and provides real-time progress updates via Socket.IO WebSocket gateway.

## Module Structure

### Core Files

-   **upload-large-xlsx.module.ts** - Main module configuration with BullMQ queue registration
-   **upload-large-xlsx.controller.ts** - REST API endpoints for file upload and task management
-   **upload-large-xlsx.service.ts** - Business logic for file upload and task operations
-   **upload-large-xlsx.gateway.ts** - Socket.IO WebSocket gateway for real-time updates
-   **redis.service.ts** - Redis service for caching and session management

### Queue System (upload-large-xlsx.queue folder)

-   **interfaces.ts** - Shared TypeScript interfaces for job data types
-   **upload-large-xlsx.queue.ts** - Queue service for managing job operations
-   **processing.processor.ts** - Handles file processing (workbook loading, header validation, data extraction)
-   **validation.processor.ts** - Handles chunk validation of extracted data using Zod schema
-   **saving.processor.ts** - Handles saving validated data chunks to database

### Supporting Files

-   **dto/create-upload-large-xlsx.dto.ts** - Data transfer objects
-   **swagger/upload-large-xlsx.swagger.ts** - Swagger API documentation configuration

## API Endpoints

-   `POST /applications/upload-large-xlsx/upload` - Upload XLSX file
-   `GET /applications/upload-large-xlsx/tasks` - Get all tasks
-   `GET /applications/upload-large-xlsx/tasks/:taskId` - Get specific task by ID
-   `DELETE /applications/upload-large-xlsx/delete-data-by-task-id/:taskId` - Delete task and associated data

## BullMQ Processors

### ProcessingProcessor (upload-xlsx-processing queue)

-   Loads XLSX workbook using ExcelJS
-   Validates worksheet headers (Name, Gender, Bio-ID)
-   Extracts row data and prepares for validation
-   **Note**: Includes buffer handling logic to fix BullMQ serialization issues where Buffer objects get converted to `{data: number[]}` format when stored in Redis

### ValidationProcessor (upload-xlsx-validation queue)

-   Validates data chunks using Zod schema
-   Tracks validation progress and error handling
-   Stores validation errors in database for reporting

### SavingProcessor (upload-xlsx-saving queue)

-   Saves validated data chunks to database
-   Tracks saving progress and completion status
-   Updates task completion state

## Job Flow

1. **File Upload** → `UploadLargeXlsxService.uploadXlsx()` creates task with PENDING status
2. **Processing Queue** → `ProcessingProcessor` handles workbook loading + header validation
3. **Validation Queue** → `ValidationProcessor` validates data chunks in parallel
4. **Saving Queue** → `SavingProcessor` saves validated data to database
5. **Real-time Updates** → Gateway emits progress updates throughout the entire process

## Socket.IO Gateway Lifecycle

The `UploadLargeXlsxGateway` provides real-time WebSocket communication for task progress tracking.

### Gateway Initialization

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

Called by processors to emit real-time updates:

-   **`emitWorkbookLoadingStatus(taskId)`** - Workbook loading phase
-   **`emitHeaderValidationStatus(taskId)`** - Header validation phase
-   **`emitProcessingCompleted(taskId, totalRows)`** - Processing completion
-   **`emitTaskProgress(taskId, progressData)`** - Validation/saving progress
-   **`emitTaskCompleted(taskId, finalData)`** - Task completion
-   **`emitTaskFailed(taskId, error)`** - Task failure notification

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

1. **PENDING** → Task created, queued for processing
2. **LOADING_WORKBOOK** → `workbook-loading` event emitted
3. **VALIDATING_HEADERS** → `header-validation` event emitted
4. **VALIDATING** → `processing-completed` event + continuous `task-progress` events
5. **SAVING** → Continuous `task-progress` events with saving progress
6. **COMPLETED/FAILED** → Final `task-completed` or `task-failed` event
