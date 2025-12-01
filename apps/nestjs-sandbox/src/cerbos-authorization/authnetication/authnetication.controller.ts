import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
} from "@nestjs/common";
import { AuthneticationService } from "./authnetication.service";
import { SignUpDto, signUpSchema } from "./dto/signup.dto";
import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";
import {
	signUpBodyOptions,
	signUpOperationOptions,
} from "./swagger/signup.swagger";
import { SignUpPipe } from "./pipes/signup.pipe";
import {
	signInBodyOptions,
	signInOperationOptions,
} from "./swagger/signin.swagger";
import { SignInPipe } from "./pipes/signin.pipe";
import { SignInDto, signInSchema } from "./dto/signin.dto";

@Controller("authnetication")
export class AuthneticationController {
	constructor(
		private readonly authneticationService: AuthneticationService
	) {}

	@ApiTags("Authentication")
	@ApiOperation(signUpOperationOptions)
	@ApiBody(signUpBodyOptions)
	@UsePipes(new SignUpPipe(signUpSchema))
	@Post("sign-up")
	async signUp(@Body() signUpDto: SignUpDto) {
		return await this.authneticationService.signUp(signUpDto);
	}

	@ApiTags("Authentication")
	@ApiOperation(signInOperationOptions)
	@ApiBody(signInBodyOptions)
	@UsePipes(new SignInPipe(signInSchema))
	@Post("sign-in")
	signIn(@Body() signInDto: SignInDto) {
		return this.authneticationService.signIn(signInDto);
	}
}
