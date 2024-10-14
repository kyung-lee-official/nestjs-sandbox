import { Injectable, NotFoundException } from "@nestjs/common";
import { SignUpDto } from "./dto/signup.dto";
import { PrismaService } from "src/recipes/prisma/prisma.service";
import { SignInDto } from "./dto/signin.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthneticationService {
	constructor(
		private readonly prismaService: PrismaService,
		private jwtService: JwtService
	) {}

	async signUp(signUpDto: SignUpDto) {
		const { id } = signUpDto;
		return await this.prismaService.member.create({
			data: {
				id,
			},
		});
	}

	async signIn(signInDto: SignInDto) {
		const { id } = signInDto;
		const member = await this.prismaService.member.findUnique({
			where: {
				id,
			},
		});
		if (!member) {
			throw new NotFoundException(`Member with id ${id} not found`);
		}
		const jwt = this.jwtService.sign({ id });
		return { jwt };
	}
}
