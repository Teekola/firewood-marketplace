import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env/server";
import { routing } from "@/i18n/routing";

// This is used so that the defined keys are not undefined
type AuthPages = AuthOptions["pages"] & {
   signIn: string;
};

export const pages: AuthPages = {
   signIn: "/auth/sign-in",
};

export const authPages = [pages.signIn];
export const protectedPages = [...Object.values(routing.pathnames["/secret-page"])];
export const CALLBACK_URL_KEY = "callbackUrl";
export const DEFAULT_ROUTE = "/";

export const authOptions = {
   providers: [
      GoogleProvider({
         clientId: env.AUTH_GOOGLE_ID,
         clientSecret: env.AUTH_GOOGLE_SECRET,
         allowDangerousEmailAccountLinking: true,
      }),
   ],
   pages,
} satisfies AuthOptions;
