import { z } from "zod";

export const createSchema = z.object({
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
});
