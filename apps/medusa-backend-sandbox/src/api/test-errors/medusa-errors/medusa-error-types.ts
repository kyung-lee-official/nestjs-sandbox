// map of Medusa error types to HTTP status codes
export const MedusaErrorTypes: Record<string, Record<string, number>> = {
	database_error: {
		"MEDUSA.GENERIC_ERROR": 500,
	},
	duplicate_error: {
		"MEDUSA.DUPLICATE_ERROR": 409,
	},
	invalid_argument: {
		"MEDUSA.INVALID_ARGUMENT": 400,
	},
	unexpected_state: {
		"MEDUSA.UNEXPECTED_STATE": 400,
	},
	invalid_data: {
		"MEDUSA.INVALID_DATA": 400,
	},
	unauthorized: {
		"MEDUSA.UNAUTHENTICATED": 401,
	},
	not_found: {
		"MEDUSA.NOT_FOUND": 404,
	},
	not_allowed: {
		"MEDUSA.NOT_ALLOWED": 403,
	},
	conflict: {
		"MEDUSA.CONFLICT": 409,
	},
	payment_authorization_error: {
		"MEDUSA.PAYMENT_AUTHORIZATION_ERROR": 402,
	},
} as const;
