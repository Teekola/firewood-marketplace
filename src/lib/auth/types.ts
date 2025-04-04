import { DefaultSession, NextAuthConfig } from "next-auth";

import { authWithBuyer, authWithSeller } from "./auth";

// DO NOT IMPORT PRISMA IN THIS FILE, OR IN MIDDLEWARE, OTHERWISE VERCEL DEPLOYMENT FAILS
// Define Unit System Enum
export const UnitSystem = {
   METRIC: "METRIC",
   IMPERIAL: "IMPERIAL",
} as const;

export type UnitSystemT = keyof typeof UnitSystem;

// Extend next-auth types
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
   interface JWT {
      id: string;
      preferredUnitSystem?: UnitSystemT;
      isRegistered?: boolean;
   }
}

// Define AuthPages type for next-auth pages
export type AuthPages = NextAuthConfig["pages"];

export type SessionWithBuyer = Awaited<ReturnType<typeof authWithBuyer>>;
export type SessionWithSeller = Awaited<ReturnType<typeof authWithSeller>>;
