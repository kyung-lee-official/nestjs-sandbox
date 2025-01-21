import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/recipes/prisma/prisma.service";
import { GRPC as Cerbos } from "@cerbos/grpc";
import { inspect } from "node:util";
import { getCerbosPrincipal } from "src/utils/data";
import { CheckResourcesRequest, ResourceCheck } from "@cerbos/core";

const cerbos = new Cerbos(process.env.CERBOS as string, { tls: false });

@Injectable()
export class GetCerbosGuard implements CanActivate {
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

		/* principal */
		const principal = getCerbosPrincipal(requester);

		/* actions */
		const actions = ["get"];

		/* resource */
		const performanceIds = await this.prismaService.performance.findMany({
			select: {
				id: true,
			},
		});
		const resources: ResourceCheck[] = performanceIds.map(
			(performanceId) => ({
				resource: {
					kind: "internal:roles",
					id: `${performanceId.id}`,
				},
				actions: actions,
			})
		);

		const checkResourcesRequest: CheckResourcesRequest = {
			principal: principal,
			resources: resources,
		};
		const decision = await cerbos.checkResources(checkResourcesRequest);

		const result = decision.results.every(
			(result) => result.actions.get === "EFFECT_ALLOW"
		);

		return result;
	}
}
