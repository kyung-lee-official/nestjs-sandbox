import { ApiBodyOptions, ApiOperationOptions } from "@nestjs/swagger";
import { GetAccessmentByIdDto } from "../dto/get-accessment-by-id.dto";

export class GetAccessmentById {
	principalName: string;
	accessmentId: string;

	constructor(dto: GetAccessmentByIdDto) {
		this.principalName = dto.principalName;
		this.accessmentId = dto.accessmentId;
	}
}

export const getAccessmentByIdOperationOptions: ApiOperationOptions = {
	summary: "Get accessment by principal",
	description:
		"for testing conveniences, provides principal directly without token",
};

export const getAccessmentByIdOptions: ApiBodyOptions = {
	type: GetAccessmentById,
	examples: {
		"Admin get Bob's accessment": {
			value: {
				principalName: "Kyung",
				accessmentId: "accessment_03",
			},
		},
		"Alice get Bob's accessment": {
			value: {
				principalName: "Alice",
				accessmentId: "accessment_03",
			},
		},
	},
};
