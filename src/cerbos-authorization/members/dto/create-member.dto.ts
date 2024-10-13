import { z } from "zod";

export const createMemberSchema = z
	.object({
		id: z.string(),
	})
	.required();

export type CreateMemberDto = z.infer<typeof createMemberSchema>;
