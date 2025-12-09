import { model } from "@medusajs/framework/utils";

export const Tester = model.define("tester", {
	id: model.id().primaryKey(),
	first_name: model.text(),
	last_name: model.text(),
	email: model.text().unique(),
	avatar_url: model.text().nullable(),
});
