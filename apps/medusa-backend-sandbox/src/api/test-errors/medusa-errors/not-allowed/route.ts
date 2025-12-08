import { MedusaError } from "@medusajs/framework/utils";

export async function GET() {
	throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "operation not allowed");
}

const returnedError = {
	type: "not_allowed",
	message: "operation not allowed",
};
