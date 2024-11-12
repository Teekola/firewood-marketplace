import { NextResponse } from "next/server";

import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";

import {
   CALLBACK_URL_KEY,
   DEFAULT_ROUTE,
   authOptions,
   authPages,
   newUserPages,
   pages,
   protectedPages,
} from "@/auth/auth-options";

import { routing } from "./i18n/routing";
import { testPathnameRegex } from "./lib/utils";

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

   const isRegistered = isSignedIn && !!auth.user.isRegistered;
   const isNewUserPage = testPathnameRegex({ paths: newUserPages, pathName: nextUrl.pathname });

   // Redirect new users to register flow
   // TODO: Ensure that after the flow is completed, the token gets updated with isRegistered=true
   // TODO: Need to ask if the user intends to buy or sell or both
   // TODO: Need to ask preferences (metric system vs. imperial system)
   // TODO: Design the flow such that the user who intends to buy gets to the request offers asap,
   // and the user who intends to sell gets to choose to either setup the selling or request offers
   if (isProtectedRoute && isSignedIn && !isRegistered && !isNewUserPage) {
      const redirectUrl = new URL(
         `${pages.newUser}?${CALLBACK_URL_KEY}=${nextUrl.href}`,
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
