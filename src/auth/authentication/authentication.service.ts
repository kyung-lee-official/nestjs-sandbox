import { Injectable, NotFoundException } from "@nestjs/common";
import { SignInDto } from "./dto/sign-in.dto";
import { PrismaService } from "src/recipes/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticationService {
	constructor(
		private readonly prismaService: PrismaService,
		private jwtService: JwtService
	) {}
	async signin(signInDto: SignInDto): Promise<{ jwt: string }> {
		const { id } = signInDto;
		const member = await this.prismaService.member.findUnique({
			where: { id },
		});
		if (!member) {
			throw new NotFoundException("Member not found");
		}
		const jwt = this.jwtService.sign({ id });
		return { jwt };
	}
}
