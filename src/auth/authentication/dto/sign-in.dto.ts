import { z } from "zod";

export const signInSchema = z
	.object({
		id: z.string().trim().toLowerCase(),
	})
	.required();

export type SignInDto = z.infer<typeof signInSchema>;
