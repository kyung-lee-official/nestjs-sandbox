import zod from "zod";

export const UserSchema = zod.object({
  id: zod.uuid(),
  email: zod.email(),
  role: zod.enum(["admin", "user", "guest"]),
});

export type User = zod.infer<typeof UserSchema>;
