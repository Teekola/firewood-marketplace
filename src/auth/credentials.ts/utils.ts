import * as z from "zod";

import { env } from "@/env/server";

export const PASSWORD_PEPPER = env.AUTH_PASSWORD_PEPPER;

export const credentialsSchema = z.object({
   username: z.string().email().min(3, "Please, provide a valid email."),
   password: z.string().min(8, "Password must be at least 8 characters."),
});
