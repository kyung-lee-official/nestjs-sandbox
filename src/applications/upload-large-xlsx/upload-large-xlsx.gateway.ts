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

export interface TaskProgressData {
	status: string;
	validationProgress: number;
	savingProgress: number;
	validatedRows: number;
	errorRows: number;
	savedRows: number;
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
	@SubscribeMessage("join-task")
	handleJoinTask(@MessageBody() data: { taskId: number }, client: Socket) {
		const roomName = `task-${data.taskId}`;
		client.join(roomName);
		this.logger.log(`Client ${client.id} joined task room: ${roomName}`);
		/* Now client will receive updates for this task only */
		return { event: "joined-task", data: { taskId: data.taskId } };
	}
	@SubscribeMessage("leave-task")
	handleLeaveTask(@MessageBody() data: { taskId: number }, client: Socket) {
		const roomName = `task-${data.taskId}`;
		client.leave(roomName);
		this.logger.log(`Client ${client.id} left task room: ${roomName}`);
		/* No more updates for this task */
		return { event: "left-task", data: { taskId: data.taskId } };
	}

	/* Progress Broadcasting (From Job Processors) */
	/* Method to emit task progress updates */
	emitTaskProgress(taskId: number, progressData: TaskProgressData) {
		const roomName = `task-${taskId}`;
		this.server.to(roomName).emit("task-progress", {
			taskId,
			...progressData,
			timestamp: new Date().toISOString(),
		});
	}
	/* Method to emit task completion */
	emitTaskCompleted(taskId: number, finalData: any) {
		const roomName = `task-${taskId}`;
		this.server.to(roomName).emit("task-completed", {
			taskId,
			...finalData,
			timestamp: new Date().toISOString(),
		});
	}
	/* Method to emit task failure */
	emitTaskFailed(taskId: number, error: string) {
		const roomName = `task-${taskId}`;
		this.server.to(roomName).emit("task-failed", {
			taskId,
			error,
			timestamp: new Date().toISOString(),
		});
	}
	/* Method to emit workbook loading status */
	emitWorkbookLoadingStatus(taskId: number) {
		const roomName = `task-${taskId}`;
		this.server.to(roomName).emit("workbook-loading", {
			taskId,
			status: "LOADING_WORKBOOK",
			message: "Loading workbook...",
			timestamp: new Date().toISOString(),
		});
	}
	/* Method to emit header validation status */
	emitHeaderValidationStatus(taskId: number) {
		const roomName = `task-${taskId}`;
		this.server.to(roomName).emit("header-validation", {
			taskId,
			status: "VALIDATING_HEADERS",
			message: "Validating headers...",
			timestamp: new Date().toISOString(),
		});
	}
	/* Method to emit processing completion */
	emitProcessingCompleted(taskId: number, totalRows: number) {
		const roomName = `task-${taskId}`;
		this.server.to(roomName).emit("processing-completed", {
			taskId,
			status: "VALIDATING",
			message: `Processing completed. Found ${totalRows} rows. Starting validation...`,
			totalRows,
			timestamp: new Date().toISOString(),
		});
	}
}
