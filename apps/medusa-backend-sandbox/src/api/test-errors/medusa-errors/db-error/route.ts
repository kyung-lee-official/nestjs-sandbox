import { MedusaError } from "@medusajs/framework/utils";

export async function GET() {
	throw new MedusaError(MedusaError.Types.DB_ERROR, "unknown database error");
}

const returnedError = {
	code: "api_error",
	type: "database_error",
	message: "unknown database error",
};
