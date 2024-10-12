import { Controller, Get, Post, Body, UsePipes } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { SignInDto, signInSchema } from "./dto/sign-in.dto";
import { SignInPipe } from "./pipes/sign-in.pipe";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { SignInOptions } from "./swagger/swagger";

@Controller("authentication")
export class AuthenticationController {
	constructor(
		private readonly authenticationService: AuthenticationService
	) {}

	@ApiOperation({
		summary: "Sign in",
		description: "# Sign in",
	})
	@ApiBody(SignInOptions)
	@Post("sign-in")
	@UsePipes(new SignInPipe(signInSchema))
	async signin(@Body() signInDto: SignInDto): Promise<{ jwt: string }> {
		return this.authenticationService.signin(signInDto);
	}
}
