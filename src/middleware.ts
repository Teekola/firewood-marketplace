import { NextRequest } from "next/server";

import createMiddleware from "next-intl/middleware";

import { auth } from "@/auth";

import { authMiddlewarePages } from "./auth/auth-config";
import { routing } from "./i18n/routing";
import { testPathnameRegex } from "./lib/utils";

const authMiddleware = auth((req) => {
   return handleI18nRouting(req);
});

const handleI18nRouting = createMiddleware(routing);

export default function middleware(req: NextRequest) {
   const isAuthMiddlewarePage = testPathnameRegex({
      paths: authMiddlewarePages,
      pathName: req.nextUrl.pathname,
   });

   if (isAuthMiddlewarePage) {
      return authMiddleware(req, {});
   }

   return handleI18nRouting(req);
}

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
