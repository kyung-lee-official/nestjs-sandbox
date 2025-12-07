import axios from "axios";
import z from "zod";

enum ErrorType {
	BUSINESS = "BUSINESS",
	SYSTEM = "SYSTEM",
}

const NormalizedErrorSchema = z.object({
	code: z.string(), // Error code, e.g., "PRODUCT_NOT_FOUND"
	message: z.string(), // Human-readable message
	details: z.any().optional(), // optional, framework-specific details (e.g. Zod errors)
	timestamp: z.iso.datetime(), // ISO timestamp of when the error occurred
});
export type NormalizedError = z.infer<typeof NormalizedErrorSchema>;

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
	headers: {
		"x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
	},
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error.response?.status;

		// Non-existent endpoint
		if (
			status === 404 &&
			error.response?.headers["content-type"] === "text/html; charset=utf-8"
		) {
			return Promise.reject({
				status,
				code: "SYSTEM.ENDPOINT_NOT_FOUND",
				message: `The requested endpoint ${error.config.url} was not found on the server.`,
				type: ErrorType.SYSTEM,
				requestId: error.response?.headers["x-request-id"],
			});
		}

		if (error.response?.data) {
			return Promise.reject({
				status,
				...error.response.data.error,
				type:
					Math.floor(status / 100) === 4
						? ErrorType.BUSINESS
						: ErrorType.SYSTEM,
			});
		}

		// Fallback for unexpected cases (network error, 500 without body, etc.)
		const fallback = {
			status: error.response?.status || 0,
			code: "UNKNOWN_ERROR",
			message:
				error.response?.status === 500
					? "Something went wrong on the server"
					: error.message || "Network Error",
			requestId: error.response?.headers["x-request-id"],
		};

		return Promise.reject(fallback);
	},
);
