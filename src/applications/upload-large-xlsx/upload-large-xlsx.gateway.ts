import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	MessageBody,
} from "@nestjs/websockets";
import { Logger, Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { RedisProgressStatusSchema, Task } from "./types";
import {
	UploadXlsxIncomingEvents,
	UploadXlsxOutgoingEvents,
} from "./websocket-events.enum";

export interface TaskProgressData {
	phase?: string;
	progress?: number;
	totalRows?: number;
	validatedRows?: number;
	errorRows?: number;
	savedRows?: number;
}

/* When NestJS app starts up */
@Injectable()
@WebSocketGateway({
	cors: {
		origin: "*",
	},
	namespace: "/upload-xlsx",
})
export class UploadLargeXlsxGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server!: Server;
	private logger: Logger = new Logger("UploadLargeXlsxGateway");

	afterInit(server: Server) {
		this.logger.log("Upload XLSX WebSocket Gateway initialized");
	}

	/* Client Connection Handling */
	/* New client connects to /upload-xlsx namespace */
	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
	}
	/* Client disconnects (tab close, network issue, etc.) */
	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	/* Room Management */
	@SubscribeMessage(UploadXlsxIncomingEvents.JOIN_TASK)
	handleJoinTask(@MessageBody() data: { taskId: number }, client: Socket) {
		const roomName = `task-${data.taskId}`;
		client.join(roomName);
		this.logger.log(`Client ${client.id} joined task room: ${roomName}`);
		/* Now client will receive updates for this task only */
		return {
			event: UploadXlsxOutgoingEvents.JOINED_TASK,
			data: { taskId: data.taskId },
		};
	}
	@SubscribeMessage(UploadXlsxIncomingEvents.LEAVE_TASK)
	handleLeaveTask(@MessageBody() data: { taskId: number }, client: Socket) {
		const roomName = `task-${data.taskId}`;
		client.leave(roomName);
		this.logger.log(`Client ${client.id} left task room: ${roomName}`);
		/* No more updates for this task */
		return {
			event: UploadXlsxOutgoingEvents.LEFT_TASK,
			data: { taskId: data.taskId },
		};
	}

	/* Progress Broadcasting (From Job Processors) */
	/* Method to emit task progress updates */
	emitTaskProgress(taskId: number, progressData: TaskProgressData) {
		const roomName = `task-${taskId}`;
		this.server.to(roomName).emit(UploadXlsxOutgoingEvents.TASK_PROGRESS, {
			taskId,
			...progressData,
			timestamp: new Date().toISOString(),
		});
	}
	/* Method to emit task completion */
	emitTaskCompleted(taskId: number, finalData: Task) {
		const roomName = `task-${taskId}`;
		this.server
			.to(roomName)
			.emit(UploadXlsxOutgoingEvents.TASK_COMPLETED, finalData);
	}
	/* Method to emit task failure */
	emitTaskFailed(taskId: number, error: string) {
		const roomName = `task-${taskId}`;
		this.server.to(roomName).emit(UploadXlsxOutgoingEvents.TASK_FAILED, {
			taskId,
			error,
			timestamp: new Date().toISOString(),
		});
	}
	/* Method to emit workbook loading status */
	emitWorkbookLoadingStatus(taskId: number) {
		const roomName = `task-${taskId}`;
		this.server
			.to(roomName)
			.emit(UploadXlsxOutgoingEvents.WORKBOOK_LOADING, {
				taskId,
				status: RedisProgressStatusSchema.enum.LOADING_WORKBOOK,
				message: "Loading workbook...",
				timestamp: new Date().toISOString(),
			});
	}
	/* Method to emit header validation status */
	emitHeaderValidationStatus(taskId: number) {
		const roomName = `task-${taskId}`;
		this.server
			.to(roomName)
			.emit(UploadXlsxOutgoingEvents.HEADER_VALIDATION, {
				taskId,
				status: RedisProgressStatusSchema.enum.VALIDATING_HEADERS,
				message: "Validating headers...",
				timestamp: new Date().toISOString(),
			});
	}
	/* Method to emit processing completion */
	emitProcessingCompleted(taskId: number, totalRows: number) {
		const roomName = `task-${taskId}`;
		this.server
			.to(roomName)
			.emit(UploadXlsxOutgoingEvents.PROCESSING_COMPLETED, {
				taskId,
				status: RedisProgressStatusSchema.enum.VALIDATING,
				message: `Processing completed. Found ${totalRows} rows. Starting validation...`,
				totalRows,
				timestamp: new Date().toISOString(),
			});
	}
}
