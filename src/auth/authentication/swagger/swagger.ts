import { ApiBodyOptions } from "@nestjs/swagger";

export const SignInOptions: ApiBodyOptions = {
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
				id: "bob",
			},
		},
	},
};
