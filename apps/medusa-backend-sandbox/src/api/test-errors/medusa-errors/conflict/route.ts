import { MedusaError } from "@medusajs/framework/utils";

export async function GET() {
	throw new MedusaError(
		MedusaError.Types.CONFLICT,
		"resource conflict occurred",
	);
}

const returnedError = {
	code: "invalid_state_error",
	type: "conflict",
	message:
		"The request conflicted with another request. You may retry the request with the provided Idempotency-Key.",
};
