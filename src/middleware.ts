import { NextResponse } from "next/server";

import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";

import { authOptions } from "@/auth/auth-options";
import {
   CALLBACK_URL_KEY,
   DEFAULT_ROUTE,
   authPages,
   pages,
   protectedPages,
} from "@/auth/constants";
import { routing } from "@/i18n/routing";
import { testPathnameRegex } from "@/lib/utils";

const handleI18nRouting = createMiddleware(routing);

const { auth } = NextAuth(authOptions);

export default auth(async function middleware(req) {
   const { auth, nextUrl } = req;

   const isSignedIn = !!auth;

   const isProtectedRoute = testPathnameRegex({
      paths: protectedPages,
      pathName: nextUrl.pathname,
   });

   // Redirect to sign in with callback url
   if (isProtectedRoute && !isSignedIn) {
      const redirectUrl = new URL(
         `${pages.signIn}?${CALLBACK_URL_KEY}=${nextUrl.href}`,
         nextUrl.origin
      );
      return NextResponse.redirect(redirectUrl);
   }

   const isAuthPage = testPathnameRegex({ paths: authPages, pathName: nextUrl.pathname });

   // Redirect to callback url or default
   if (isAuthPage && isSignedIn) {
      const targetUrl = new URL(
         nextUrl.searchParams.get(CALLBACK_URL_KEY) ?? DEFAULT_ROUTE,
         nextUrl.origin
      );
      return NextResponse.redirect(targetUrl);
   }

   return handleI18nRouting(req);
});

// You can also use a regex to match multiple routes or you can negate certain
// routes in order to protect all remaining routes. The following example avoids
// running the middleware on paths such as the favicon or static images.
export const config = {
   matcher: [
      // Match all pathnames except for
      // - … if they start with `/api`, `/_next` or `/_vercel`
      // - … the ones containing a dot (e.g. `favicon.ico`)
      "/((?!api|_next|_vercel|.*\\..*).*)",
   ],
};
