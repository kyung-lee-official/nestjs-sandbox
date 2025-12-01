import { Controller, Post } from "@nestjs/common";
import { ResendService } from "./resend.service";

@Controller("resend")
export class ResendController {
	constructor(private readonly resendService: ResendService) {}

	@Post()
	sendEmail() {
		return this.resendService.sendEmail();
	}
}
