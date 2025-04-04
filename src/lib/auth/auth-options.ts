import { type NextAuthConfig } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

import { env } from "@/env/server";

import { baseUrl, pages } from "./constants";
import { credentialsProvider, googleProvider } from "./providers";
import { UnitSystem } from "./types";

// NOTE: DO NOT IMPORT PRISMA IN THIS FILE, OR IN MIDDLEWARE, OTHERWISE VERCEL DEPLOYMENT FAILS

export const authOptions = {
   providers: [googleProvider, credentialsProvider],
   pages, // TODO: Add /auth/error page
   callbacks: {
      async jwt({ token, user, trigger, session }) {
         if (trigger === "signUp") {
            // NOTE: CANNOT USE PRISMA DIRECTLY
            const url = `${baseUrl}/api/auth/register-user?id=${user.id}`;
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
