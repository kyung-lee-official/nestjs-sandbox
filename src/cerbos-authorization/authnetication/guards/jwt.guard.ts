import {
	Injectable,
	CanActivate,
	ExecutionContext,
	BadRequestException,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		console.log(req.headers);
		
		if (req.headers.authorization) {
			try {
				const payload = await this.jwtService.verify(
					req.headers.authorization.replace("Bearer ", "")
				);
				req.jwtPayload = payload;
				return true;
			} catch (error) {
				throw new UnauthorizedException("Invalid token");
			}
		} else {
			throw new BadRequestException("Missing token");
		}
		return true;
	}
}
