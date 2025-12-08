import { MedusaError } from "@medusajs/framework/utils";

export async function GET() {
	throw new MedusaError(
		MedusaError.Types.UNEXPECTED_STATE,
		"unexpected state encountered",
	);
}

const returnedError = {
	type: "unexpected_state",
	message: "unexpected state encountered",
};
