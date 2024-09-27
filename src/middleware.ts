import { auth, authPages } from "@/auth";

export default auth((req) => {
   const isSignedIn = !!req.auth;
   const isAuthPage = req.nextUrl.pathname.startsWith(authPages.signIn);

   if (!isSignedIn && !isAuthPage) {
      const newUrl = new URL(`${authPages.signIn}?callbackUrl=${req.nextUrl}`, req.nextUrl.origin);
      return Response.redirect(newUrl);
   }

   if (isAuthPage) {
      if (isSignedIn) {
         return Response.redirect(new URL("/", req.nextUrl.origin));
      }
   }
});

// You can also use a regex to match multiple routes or you can negate certain
// routes in order to protect all remaining routes. The following example avoids
// running the middleware on paths such as the favicon or static images.
export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
