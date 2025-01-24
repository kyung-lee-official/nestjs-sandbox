import { z } from "zod";

export const updateAccessmentByIdSchema = z
	.object({
		memberId: z.string().toLowerCase(),
		id: z.string().toLowerCase(),
	})
	.required();

export type UpdateAccessmentByIdDto = z.infer<typeof updateAccessmentByIdSchema>;
