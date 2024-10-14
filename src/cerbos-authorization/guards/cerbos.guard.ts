import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class CerbosGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const requester = req.user;
		return true;
	}
}
