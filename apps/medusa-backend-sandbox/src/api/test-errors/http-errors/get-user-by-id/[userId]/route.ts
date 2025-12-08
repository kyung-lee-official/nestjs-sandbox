import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { HttpError } from "../../../errors/src";

const mockDb = {
	users: [
		{ id: 1, name: "Alice" },
		{ id: 2, name: "Bob" },
	],
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const { userId } = req.params;
	const user = mockDb.users.find((u) => u.id === Number(userId));
	if (!user) {
		throw new HttpError("USER.NOT_FOUND", "User not found", {
			foo: { userId },
		});
	}
	res.status(200).json(user);
}
