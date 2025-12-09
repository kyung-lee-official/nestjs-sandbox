// packages/errors/src/index.ts
import {
	type ApiErrorResponse,
	ERROR_CODE_TO_STATUS,
	type ErrorCode,
} from "./errors";

export class HttpError extends Error {
	public readonly status: number;
	public readonly code: ErrorCode;
	public readonly details?: Record<string, any>;
	public readonly timestamp: string;

	constructor(
		code: ErrorCode,
		message?: string,
		details?: Record<string, any>,
	) {
		super(message ?? code);
		this.name = "HttpError";
		this.code = code;
		this.details = details;
		this.status = ERROR_CODE_TO_STATUS[code] ?? 500;
		this.timestamp = new Date().toISOString();

		// For better stack traces in Node.js
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HttpError);
		}
	}

	// Convert to JSON response (for Express, Fastify, etc.)
	toJSON(): ApiErrorResponse {
		return {
			error: {
				code: this.code,
				message: this.message !== this.code ? this.message : undefined,
				details: this.details,
				timestamp: this.timestamp,
			},
		};
	}
}
