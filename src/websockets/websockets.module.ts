import { Module } from "@nestjs/common";
import { ChatService } from "./websockets.service";
import { ChatGateway } from "./chat.gateway";
import { DashboardGateway } from "./dashboard.gateway";

@Module({
	providers: [ChatGateway, ChatService, DashboardGateway],
})
export class WebsocketsModule {}
