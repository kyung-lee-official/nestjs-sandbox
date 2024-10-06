import { ApiBodyOptions, ApiParamOptions } from "@nestjs/swagger";

export const CreateMemberOptions: ApiBodyOptions = {
	schema: {
		properties: {
			id: {
				type: "string",
			},
		},
	},
	examples: {
		bob: {
			value: {
				id: "bob",
			},
		},
	},
};

export const RemoveMemberOptions: ApiParamOptions = {
	name: "id",
	required: true,
	description: "Member ID",
	example: "bob",
};
