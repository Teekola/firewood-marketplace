import { NextResponse } from "next/server";

import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import { testPathnameRegex } from "@/lib/utils";

// This is used so that the defined keys are not undefined
type AuthPages = NextAuthConfig["pages"] & {
   signIn: string;
};

export const pages: AuthPages = {
   signIn: "/auth/sign-in",
};

export const authPages = [pages.signIn];
export const protectedPages = ["/secret-page"];
export const authMiddlewarePages = authPages.concat(protectedPages);
const CALLBACK_URL_KEY = "callbackUrl";
const DEFAULT_ROUTE = "/";

export const authConfig = {
   providers: [Google],
   callbacks: {
      authorized: async ({ auth, request: { nextUrl } }) => {
         const isSignedIn = !!auth;

         console.log("AUTHORIZED");

         const isProtectedRoute = testPathnameRegex({
            paths: protectedPages,
            pathName: nextUrl.pathname,
         });

         if (isProtectedRoute && isSignedIn) {
            console.log({ isProtectedRoute, isSignedIn });
            return true;
         }

         if (isProtectedRoute && !isSignedIn) {
            const redirectUrl = new URL(
               `${pages.signIn}?${CALLBACK_URL_KEY}=${nextUrl.href}`,
               nextUrl.origin
            );
            console.log("Redirecting to", redirectUrl.href);
            return NextResponse.redirect(redirectUrl);
         }
         const isAuthPage = testPathnameRegex({ paths: authPages, pathName: nextUrl.pathname });

         console.log({ isAuthPage });

         if (isAuthPage && isSignedIn) {
            const targetUrl = new URL(
               nextUrl.searchParams.get(CALLBACK_URL_KEY) ?? DEFAULT_ROUTE,
               nextUrl.origin
            );
            console.log("Redirecting to", targetUrl.href);
            return NextResponse.redirect(targetUrl);
         }

         console.log("Final true");

         return true;
      },
   },
   pages,
} satisfies NextAuthConfig;
