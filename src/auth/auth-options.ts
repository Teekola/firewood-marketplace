import type { DefaultSession, NextAuthConfig } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";

import { env } from "@/env/server";
import { routing } from "@/i18n/routing";

declare module "next-auth" {
   interface Session {
      user: {
         id: string;
      } & DefaultSession["user"];
   }
}

declare module "next-auth/jwt" {
   /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
   interface JWT {
      id: string;
   }
}

// This is used so that the defined keys are not undefined
type AuthPages = NextAuthConfig["pages"] & {
   signIn: string;
};

export const pages: AuthPages = {
   signIn: "/auth/sign-in",
};
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
function getProtectedPages(protectedRoutes: string[]) {
   const pathnames = protectedRoutes.flatMap((route) => {
      const regex = regexifyPath(route);
      return Object.keys(routing.pathnames)
         .filter((path) => regex.test(path))
         .flatMap((matchedPath) =>
            Object.values(routing.pathnames[matchedPath as keyof typeof routing.pathnames])
         );
   });
   return pathnames;
}
export const protectedPages = getProtectedPages(protectedRoutes);
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
      jwt({ token, user }) {
         if (user?.id) {
            token.id = user.id;
         }
         return token;
      },
      session({ session, token }) {
         return {
            ...session,
            user: {
               ...session.user,
               id: token.id,
            },
         };
      },
   },
} satisfies NextAuthConfig;
