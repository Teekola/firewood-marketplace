import Google from "next-auth/providers/google";

import { env } from "@/env/server";

export const googleProvider = Google({
   clientId: env.AUTH_GOOGLE_ID,
   clientSecret: env.AUTH_GOOGLE_SECRET,
   allowDangerousEmailAccountLinking: true,
});
