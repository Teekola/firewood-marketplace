import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// This is used so that the defined keys are not undefined
type AuthPages = NextAuthConfig["pages"] & {
   signIn: string;
};

export const pages: AuthPages = {
   signIn: "/auth/sign-in",
};

export const authConfig = {
   providers: [Google],
   callbacks: {
      authorized: async ({ auth }) => {
         // Logged in users are authenticated, otherwise redirect to login page
         return !!auth;
      },
   },
   pages,
} satisfies NextAuthConfig;
