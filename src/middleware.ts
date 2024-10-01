import { NextResponse } from "next/server";

import createMiddleware from "next-intl/middleware";

import { auth } from "@/auth";
import { pages } from "@/auth/auth-config";

import { routing } from "./i18n/routing";

const authPages = [pages.signIn, "/auth/sign-up"];
const publicPages = ["/"].concat(authPages);
const DEFAULT_SIGNED_IN_ROUTE = "/";
const CALLBACK_URL_KEY = "callbackUrl";

const testPathnameRegex = (pages: string[], pathName: string): boolean => {
   return RegExp(
      `^(/(${routing.locales.join("|")}))?(${pages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
      "i"
   ).test(pathName);
};

const handleI18nRouting = createMiddleware(routing);

export default auth((req) => {
   return handleI18nRouting(req);
   const isSignedIn = !!req.auth;
   const isAuthPage = testPathnameRegex(authPages, req.nextUrl.pathname);

   // Redirect if signed in and on the auth page
   if (isSignedIn && isAuthPage) {
      const targetUrl = new URL(
         req.nextUrl.searchParams.get(CALLBACK_URL_KEY) ?? DEFAULT_SIGNED_IN_ROUTE,
         req.nextUrl.origin
      );

      console.log("Redirecting to the target route", {
         target: targetUrl.toString(),
         isSignedIn,
         isAuthPage,
      });
      return NextResponse.redirect(targetUrl);
   }

   const isPublicPage = testPathnameRegex(publicPages, req.nextUrl.pathname);

   // Redirect to sign-in if not signed in and not on a public page
   if (!isSignedIn && !isPublicPage) {
      const redirectUrl = new URL(
         `${pages.signIn}?${CALLBACK_URL_KEY}=${encodeURIComponent(req.nextUrl.href)}`,
         req.nextUrl.origin
      );
      console.log("Redirecting to the target route", {
         target: redirectUrl.toString(),
         isSignedIn,
         isAuthPage,
         isPublicPage,
      });
      return NextResponse.redirect(redirectUrl);
   }

   // Handle i18n routing for other requests
   // Note that after redirects, the middleware is run again
   // so this will eventually be run!
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
