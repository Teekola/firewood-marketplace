import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/prisma";

// This is used so that the defined keys are not undefined
type AuthPages = NextAuthConfig["pages"] & {
   signIn: string;
};

export const authPages: AuthPages = {
   signIn: "/auth/sign-in",
};

export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: PrismaAdapter(prisma),
   providers: [Google],
   callbacks: {
      authorized: async ({ auth }) => {
         // Logged in users are authenticated, otherwise redirect to login page
         return !!auth;
      },
   },
   pages: authPages,
});
