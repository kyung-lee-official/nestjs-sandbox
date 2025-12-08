import { MedusaError } from "@medusajs/framework/utils";

export async function GET() {
	throw new MedusaError(
		MedusaError.Types.UNAUTHORIZED,
		"sign in required to delete user",
	);
}

const returnedError = {
	type: "unauthorized",
	message: "sign in required to delete user",
};
