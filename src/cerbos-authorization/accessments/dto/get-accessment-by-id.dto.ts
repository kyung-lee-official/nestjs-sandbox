import { z } from "zod";

export const getAccessmentByIdSchema = z
	.object({
		principalName: z.string().toLowerCase(),
		accessmentId: z.string().toLowerCase(),
	})
	.required();

export type GetAccessmentByIdDto = z.infer<typeof getAccessmentByIdSchema>;
