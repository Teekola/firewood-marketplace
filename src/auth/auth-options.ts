import { CredentialsSignin, type DefaultSession, type NextAuthConfig } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { env as clientEnv } from "@/env/client";
import { env } from "@/env/server";
import { routing } from "@/i18n/routing";
import { errorSchema } from "@/lib/utils/errors";

// DO NOT IMPORT PRISMA IN THIS FILE, OR IN MIDDLEWARE, OTHERWISE VERCEL DEPLOYMENT FAILS
const UnitSystem = {
   METRIC: "METRIC",
   IMPERIAL: "IMPERIAL",
} as const;

export type UnitSystemT = keyof typeof UnitSystem;

declare module "next-auth" {
   interface Session {
      user: {
         id: string;
         preferredUnitSystem?: UnitSystemT;
         isRegistered?: boolean;
      } & DefaultSession["user"];
   }

   interface User {
      preferredUnitSystem?: UnitSystemT;
      isRegistered?: boolean;
   }
}

declare module "next-auth/jwt" {
   /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
   interface JWT {
      id: string;
      preferredUnitSystem?: UnitSystemT;
      isRegistered?: boolean;
   }
}

// This is used so that the defined keys are not undefined
type AuthPages = NextAuthConfig["pages"] & {
   signIn: string;
};

export const pages = {
   signIn: "/auth/sign-in",
} satisfies AuthPages;
export const registerPage = "/auth/register";
const registerWithEmailPage = "/auth/register/email";
const signInWithEmailPage = "/auth/sign-in/email";

// example of all routes within /dashboard: "/dashboard/.*"
const protectedRoutes = ["/dashboard", "/dashboard/.*"];

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
         .flatMap((matchedPath) => {
            // Convert dynamic paths to match any value (e.g., replace [id] with .+)
            const regexPath = matchedPath.replace(/\[.*?\]/g, ".+");
            return Object.values(routing.pathnames[matchedPath as keyof typeof routing.pathnames])
               .map((localizedPath) => {
                  // Convert localized paths similarly if they have dynamic segments
                  return localizedPath.replace(/\[.*?\]/g, ".+");
               })
               .concat(regexPath);
         });
   });
   return pathnames;
}

export const authPages = [
   pages.signIn,
   signInWithEmailPage,
   registerPage,
   registerWithEmailPage,
   ...getLocalizedPages([registerPage, registerWithEmailPage, signInWithEmailPage]),
];
export const protectedPages = getLocalizedPages(protectedRoutes);
export const DEFAULT_ROUTE = "/";

const http = env.NODE_ENV === "development" ? "http" : "https";
const baseUrl = `${http}://${clientEnv.NEXT_PUBLIC_VERCEL_URL}/api/auth/`;

export const authOptions = {
   providers: [
      Google({
         clientId: env.AUTH_GOOGLE_ID,
         clientSecret: env.AUTH_GOOGLE_SECRET,
         allowDangerousEmailAccountLinking: true,
      }),
      Credentials({
         id: "email-password",
         credentials: {
            username: { type: "text" },
            password: { type: "password" },
         },
         async authorize(credentials) {
            const response = await fetch(`${baseUrl}/authorize-user-with-email-and-password`, {
               method: "POST",
               body: JSON.stringify(credentials),
               headers: {
                  "X-Api-Key": env.INTERNAL_API_SECRET,
               },
            });
            const result = await response.json();

            // Parse the result with error schema. If it has message key, it is considered a success
            // By throwing CredentialsSignin error with customized code, we can display error in the client
            const parsedResult = errorSchema.safeParse(result);
            if (parsedResult.success) {
               const error = new CredentialsSignin();
               error.code = parsedResult.data.message;
               throw error;
            }

            return result;
         },
      }),
   ],
   pages,
   callbacks: {
      async jwt({ token, user, trigger, session }) {
         if (trigger === "signUp") {
            const url = `${baseUrl}/register-user?id=${user.id}`;
            await fetch(url, { headers: { "X-Api-Key": env.INTERNAL_API_SECRET } });
         }

         // Updates the token. The update data is provided in the session
         if (trigger === "update") {
            if (session?.user?.isRegistered) {
               token.isRegistered = session.user.isRegistered;
            }
         }

         if (user?.id) {
            token.id = user.id;
         }

         if (user?.isRegistered) {
            token.isRegistered = user.isRegistered;
         }
         return token;
      },
      session({ session, token }) {
         return {
            ...session,
            user: {
               ...session.user,
               id: token.id,
               isRegistered: token.isRegistered ?? false,
               preferredUnitSystem: token.preferredUnitSystem ?? UnitSystem.METRIC,
            },
         };
      },
   },
} satisfies NextAuthConfig;
