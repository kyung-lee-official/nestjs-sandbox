import { z } from "zod";
import { AUTH_ERRORS } from "./codes/auth";
import { USER_ERRORS } from "./codes/user";

export const ERROR_CODES = {
	...AUTH_ERRORS,
	...USER_ERRORS,
} as const;
export type ErrorCode = keyof typeof ERROR_CODES;
export const ErrorCodeSchema = z.enum(
	Object.keys(ERROR_CODES) as [ErrorCode, ...ErrorCode[]],
);
export const ERROR_CODE_TO_STATUS = ERROR_CODES;

export const ApiErrorResponseSchema = z.object({
	error: z.object({
		code: ErrorCodeSchema,
		message: z.string().optional(),
		details: z.any().optional(),
		timestamp: z.string(),
	}),
});
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
