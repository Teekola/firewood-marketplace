import { NextResponse } from "next/server";

import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";

import {
   CALLBACK_URL_KEY,
   DEFAULT_ROUTE,
   authPages,
   pages,
   protectedPages,
} from "./auth/auth-options";
import { routing } from "./i18n/routing";
import { testPathnameRegex } from "./lib/utils";

const handleI18nRouting = createMiddleware(routing);

export default withAuth(
   // Note that this callback is only invoked if
   // the `authorized` callback has returned `true`
   // and not for pages listed in `pages`.
   function middleware(req) {
      const {
         nextauth: { token },
         nextUrl,
      } = req;

      const isSignedIn = !!token;

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
         console.log("Redirecting to", redirectUrl.href);
         return NextResponse.redirect(redirectUrl);
      }
      const isAuthPage = testPathnameRegex({ paths: authPages, pathName: nextUrl.pathname });

      console.log({ isAuthPage });

      // Redirect to callback url or default
      if (isAuthPage && isSignedIn) {
         const targetUrl = new URL(
            nextUrl.searchParams.get(CALLBACK_URL_KEY) ?? DEFAULT_ROUTE,
            nextUrl.origin
         );
         console.log("Redirecting to", targetUrl.href);
         return NextResponse.redirect(targetUrl);
      }

      if (isProtectedRoute && isSignedIn) {
         console.log({ isProtectedRoute, isSignedIn });
      }

      return handleI18nRouting(req);
   },
   {
      callbacks: {
         authorized: async () => {
            return true; // Allows running the middleware always
         },
      },
   }
);

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
