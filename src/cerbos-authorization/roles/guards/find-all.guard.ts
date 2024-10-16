import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { PrismaService } from "src/recipes/prisma/prisma.service";
import { GRPC as Cerbos } from "@cerbos/grpc";

const cerbos = new Cerbos(process.env.CERBOS as string, { tls: false });

@Injectable()
export class FindAllCerbosGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const { id } = req.jwtPayload;

		const requester = await this.prismaService.role.findUnique({
			where: {
				id: id,
			},
		});
		const resource = "all-roles";
		const action = "read";

		// const cerbosResponse = await cerbos.check({
		// 	request: {
		// 		namespace: requester?.role,
		// 		object: {
		// 			kind: "all-roles",
		// 		},
		// 		action: {
		// 			name: action,
		// 		},
		// 	},
		// });

		return true;
	}
}
