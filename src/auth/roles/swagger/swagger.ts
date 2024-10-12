import { ApiBodyOptions, ApiParamOptions } from "@nestjs/swagger";

export const CreateRoleOptions: ApiBodyOptions = {
	schema: {
		properties: {
			id: {
				type: "string",
			},
		},
	},
	examples: {
		admin: {
			value: {
				id: "admin",
			},
		},
	},
};

export const RemoveRoleOptions: ApiParamOptions = {
	name: "id",
	required: true,
	description: "Role ID",
	example: "admin",
};
