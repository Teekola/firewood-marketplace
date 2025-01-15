import type { DefaultSession, NextAuthConfig } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";

import { env as clientEnv } from "@/env/client";
import { env } from "@/env/server";
import { routing } from "@/i18n/routing";

// DO NOT IMPORT PRISMA IN THIS FILE, OR IN MIDDLEWARE, OTHERWISE VERCEL DEPLOYMENT FAILS
const UnitSystem = {
   METRIC: "METRIC",
   IMPERIAL: "IMPERIAL",
} as const;

type UnitSystemT = keyof typeof UnitSystem;

declare module "next-auth" {
   interface Session {
      user: {
         id: string;
         preferredUnitSystem?: UnitSystemT;
      } & DefaultSession["user"];
   }
}

declare module "next-auth/jwt" {
   /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
   interface JWT {
      id: string;
      preferredUnitSystem?: UnitSystemT;
   }
}

// This is used so that the defined keys are not undefined
type AuthPages = NextAuthConfig["pages"] & {
   signIn: string;
};

export const pages = {
   signIn: "/auth/sign-in",
} satisfies AuthPages;

// example of all routes within /dashboard: "/dashboard/.*"
const protectedRoutes = ["/user/.*"];

export const authPages = [pages.signIn];

function regexifyPath(path: string): RegExp {
   const escaped = path.replace(/\//g, "\\/"); // replace / with \/
   return new RegExp(escaped);
}
/**
 *
 * @returns array of all localized pathnames
 */
function getLocalizedPages(routes: string[]) {
   const pathnames = routes.flatMap((route) => {
      const regex = regexifyPath(route);
      return Object.keys(routing.pathnames)
         .filter((path) => regex.test(path))
         .flatMap((matchedPath) =>
            Object.values(routing.pathnames[matchedPath as keyof typeof routing.pathnames])
         );
   });
   return pathnames;
}
export const protectedPages = getLocalizedPages(protectedRoutes);
export const CALLBACK_URL_KEY = "callbackUrl";
export const DEFAULT_ROUTE = "/";

export const authOptions = {
   providers: [
      Google({
         clientId: env.AUTH_GOOGLE_ID,
         clientSecret: env.AUTH_GOOGLE_SECRET,
         allowDangerousEmailAccountLinking: true,
      }),
   ],
   pages,
   callbacks: {
      async jwt({ token, user }) {
         if (user?.id) {
            token.id = user.id;
         }

         // If the unit system is already set in token, we can return it
         if (token.preferredUnitSystem) {
            return token;
         }

         const http = env.NODE_ENV === "development" ? "http" : "https";
         const url = `${http}://${clientEnv.NEXT_PUBLIC_VERCEL_URL}/api/auth/get-and-set-null-preferred-unit-system?id=${token.id}`;
         const preferredUnitSystem = (await (await fetch(url)).json())
            .preferredUnitSystem as UnitSystemT;

         token.preferredUnitSystem = preferredUnitSystem;

         return token;
      },
      session({ session, token }) {
         return {
            ...session,
            user: {
               ...session.user,
               id: token.id,
               preferredUnitSystem: token.preferredUnitSystem ?? UnitSystem.METRIC,
            },
         };
      },
   },
} satisfies NextAuthConfig;
