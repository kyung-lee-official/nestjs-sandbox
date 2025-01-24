import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import { GRPC as Cerbos } from "@cerbos/grpc";
import { inspect } from "node:util";
import { CheckResourcesRequest, Principal, ResourceCheck } from "@cerbos/core";
import {
	checkIsPrincipalSuperRole,
	getPrincipal,
	getResOwnerRoles,
} from "../mock-data/roles";
import { mockAccessments } from "../mock-data/accessments";

const cerbos = new Cerbos(process.env.CERBOS as string, { tls: false });

@Injectable()
export class GetAccessmentByIdGuard implements CanActivate {
	constructor() {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();

		const { principalName, accessmentId } = req.body;
		const accessment = mockAccessments.find((a) => a.id === accessmentId);
		if (!accessment) {
			throw new UnauthorizedException("Invalid accessment id");
		}

		if (!principalName) {
			throw new UnauthorizedException("Invalid requester");
		}

		/* principal */
		const principal: Principal = getPrincipal(principalName);
		console.log(inspect(principal, false, null, true));

		/* actions */
		const actions = ["get"];

		/* resource */
		const resourceOwnerRoles = getResOwnerRoles(accessment);
		const isPrincipalSuperRole = checkIsPrincipalSuperRole(
			principalName,
			resourceOwnerRoles
		);
		const resources: ResourceCheck[] = [
			{
				resource: {
					kind: "accessments",
					id: accessment.id,
					attr: {
						owner: accessment.owner,
						isPrincipalSuperRole: isPrincipalSuperRole,
					},
				},
				actions: actions,
			},
		];
		console.log(inspect(resources, false, null, true));

		const checkResourcesRequest: CheckResourcesRequest = {
			principal: principal,
			resources: resources,
		};
		const decision = await cerbos.checkResources(checkResourcesRequest);
		console.log(decision.results);

		const result = decision.results.every(
			(result) => result.actions.get === "EFFECT_ALLOW"
		);

		return result;
	}
}
