import { z } from "zod";

export const createMemberSchema = z
	.object({
		id: z.string().trim().toLowerCase(),
	})
	.required();

export type CreateMemberDto = z.infer<typeof createMemberSchema>;
