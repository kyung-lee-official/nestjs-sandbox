import {
	Injectable,
	CanActivate,
	ExecutionContext,
	BadRequestException,
	UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/recipes/prisma/prisma.service";
import { GRPC as Cerbos } from "@cerbos/grpc";
import { inspect } from "node:util";

const cerbos = new Cerbos(process.env.CERBOS as string, { tls: false });

@Injectable()
export class DeleteCerbosGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const { id } = req.jwtPayload;

		const requester = await this.prismaService.member.findUnique({
			where: {
				id: id,
			},
			include: {
				roles: true,
			},
		});
		if (!requester) {
			throw new UnauthorizedException("Invalid requester");
		}
		const resourceId = parseInt(req.params.id);
		if (isNaN(resourceId)) {
			throw new BadRequestException("Invalid resource id");
		}
		const resource = await this.prismaService.performance.findUnique({
			where: {
				id: resourceId,
			},
		});
		if (!resource) {
			throw new BadRequestException("Invalid resource");
		}

		const action = "delete";
		const cerbosObject = {
			principal: {
				id: requester.id,
				roles: requester.roles.map((role) => role.id),
				attributes: requester,
			},
			resource: {
				kind: "performance",
				id: req.params.id,
				attributes: resource,
			},
			actions: [action],
		};
		const decision = await cerbos.checkResource(cerbosObject);
		const result = !!decision.isAllowed(action);

		return result;
	}
}
