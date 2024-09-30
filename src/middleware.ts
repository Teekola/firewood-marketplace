import { NextResponse } from "next/server";

import createMiddleware from "next-intl/middleware";

import { auth } from "@/auth";
import { pages } from "@/auth/auth-config";

import { routing } from "./i18n/routing";

const authPages = [pages.signIn, "/auth/sign-up"];
const publicPages = ["/"].concat(authPages);
const DEFAULT_SIGNED_IN_ROUTE = "/";

const testPathnameRegex = (pages: string[], pathName: string): boolean => {
   return RegExp(
      `^(/(${routing.locales.join("|")}))?(${pages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
      "i"
   ).test(pathName);
};

const handleI18nRouting = createMiddleware(routing);

export default auth((req) => {
   const isSignedIn = !!req.auth;
   const isAuthPage = testPathnameRegex(authPages, req.nextUrl.pathname);

   // Redirect if signed in and on the auth page
   if (isSignedIn && isAuthPage) {
      const targetUrl = new URL(DEFAULT_SIGNED_IN_ROUTE, req.nextUrl.origin);

      // Avoid infinite loop by checking if we're already at the target URL
      if (req.nextUrl.pathname === targetUrl.pathname) {
         console.log("User is already on the target route, no need to redirect.");
         return NextResponse.next(); // Let the request proceed without redirection
      }
      console.log("Redirecting to the target route /", {
         target: new URL(DEFAULT_SIGNED_IN_ROUTE, req.nextUrl.origin).toString(),
         isSignedIn,
         isAuthPage,
      });
      return NextResponse.redirect(targetUrl);
   }

   const isPublicPage = testPathnameRegex(publicPages, req.nextUrl.pathname);

   // Redirect to sign-in if not signed in and not on a public page
   if (!isSignedIn && !isPublicPage) {
      const newUrl = new URL(`${pages.signIn}?callbackUrl=${req.nextUrl}`, req.nextUrl.origin);
      return NextResponse.redirect(newUrl);
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
