import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketServer,
} from "@nestjs/websockets";
import { WebsocketsService } from "./websockets.service";
import { CreateWebsocketDto } from "./dto/create-websocket.dto";
import { UpdateWebsocketDto } from "./dto/update-websocket.dto";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
})
export class WebsocketsGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private readonly websocketsService: WebsocketsService) {}
	@WebSocketServer()
	io!: Server;

	afterInit() {
		console.log("Initialized");
	}

	handleConnection(client: any, ...args: any[]) {
		const { sockets } = this.io.sockets;
		console.log(`Client id: ${client.id} connected`);
		console.debug(`Number of connected clients: ${sockets.size}`);
	}

	handleDisconnect(client: any) {
		console.log(`Cliend id:${client.id} disconnected`);
	}

	@SubscribeMessage("message")
	message(@MessageBody() body: any, @ConnectedSocket() clientSocket: Socket) {
		return this.websocketsService.message(body, clientSocket);
	}

	// @SubscribeMessage("createWebsocket")
	// create(@MessageBody() createWebsocketDto: CreateWebsocketDto) {
	// 	return this.websocketsService.create(createWebsocketDto);
	// }

	// @SubscribeMessage("findAllWebsockets")
	// findAll() {
	// 	return this.websocketsService.findAll();
	// }

	// @SubscribeMessage("findOneWebsocket")
	// findOne(@MessageBody() id: number) {
	// 	return this.websocketsService.findOne(id);
	// }

	// @SubscribeMessage("updateWebsocket")
	// update(@MessageBody() updateWebsocketDto: UpdateWebsocketDto) {
	// 	return this.websocketsService.update(
	// 		updateWebsocketDto.id,
	// 		updateWebsocketDto
	// 	);
	// }

	// @SubscribeMessage("removeWebsocket")
	// remove(@MessageBody() id: number) {
	// 	return this.websocketsService.remove(id);
	// }
}
