import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class WebsocketsService {
	message(body: any, clientSocket: Socket) {
		try {
			const { message } = body;
			/* log the message coming from the client */
			console.log(
				`Client ${clientSocket.id}: ${JSON.stringify(message)}`
			);
			/* 8s is long enough for testing multiple clients */
			const processingTime = 8;
			for (let i = 0; i < processingTime; i++) {
				setTimeout(() => {
					clientSocket.emit("progress", {
						progress: (i + 1) / processingTime,
					});
					if (i === processingTime - 1) {
						clientSocket.disconnect();
					}
				}, 1000 * i);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Error processing message: ${error.message}`);
			} else {
				console.error("Unknown error occurred");
			}
			clientSocket.emit("error", { message: "An error occurred" });
		}
	}

	// create(createWebsocketDto: CreateWebsocketDto) {
	// 	return "This action adds a new websocket";
	// }

	// findAll() {
	// 	return `This action returns all websockets`;
	// }

	// findOne(id: number) {
	// 	return `This action returns a #${id} websocket`;
	// }

	// update(id: number, updateWebsocketDto: UpdateWebsocketDto) {
	// 	return `This action updates a #${id} websocket`;
	// }

	// remove(id: number) {
	// 	return `This action removes a #${id} websocket`;
	// }
}
