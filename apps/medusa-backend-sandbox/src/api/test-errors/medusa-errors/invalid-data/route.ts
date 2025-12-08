import { MedusaError } from "@medusajs/framework/utils";

export async function GET() {
	throw new MedusaError(MedusaError.Types.INVALID_DATA, "invalid email");
}

const returnedError = {
	type: "invalid_data",
	message: "invalid email",
};
