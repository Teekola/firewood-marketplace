import type { DefaultSession, NextAuthConfig } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";

import { env as clientEnv } from "@/env/client";
import { env } from "@/env/server";
import { routing } from "@/i18n/routing";

// import { prismaEdge } from "@/prismaEdge";

declare module "next-auth" {
   interface Session {
      user: {
         id: string;
         isRegistered?: boolean;
      } & DefaultSession["user"];
   }
}

declare module "next-auth/jwt" {
   /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
   interface JWT {
      id: string;
      isRegistered?: boolean;
   }
}

// This is used so that the defined keys are not undefined
type AuthPages = NextAuthConfig["pages"] & {
   signIn: string;
};

export const pages = {
   signIn: "/auth/sign-in",
   newUser: "/new-user",
} satisfies AuthPages;
const protectedRoutes = ["/secret-page", "/request-offers/.*"];

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
export const newUserPages = getLocalizedPages([pages.newUser]);
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
         // Fetch this from an API route so that edge issues do not arise
         const isRegistered = (
            await (
               await fetch(
                  `${clientEnv.NEXT_PUBLIC_VERCEL_URL}/api/auth/is-registered?id=${token.id}`
               )
            ).json()
         ).isRegistered as boolean;

         token.isRegistered = isRegistered;

         return token;
      },
      session({ session, token }) {
         return {
            ...session,
            user: {
               ...session.user,
               id: token.id,
               isRegistered: token.isRegistered ?? false,
            },
         };
      },
   },
} satisfies NextAuthConfig;
