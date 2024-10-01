import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
   locales: ["fi", "en"], // A list of all locales that are supported
   localePrefix: "as-needed", // only include locale prefix for non-default locales @link https://next-intl-docs.vercel.app/docs/routing#locale-prefix-always
   defaultLocale: "fi", // Used when no locale matches

   // Define all paths, localize when needed
   pathnames: {
      "/": "/",
      "/auth/sign-in": "/auth/sign-in", // This can not be localized
      "/secret-route": {
         en: "/secret-route",
         fi: "/salainen-reitti",
      },
   },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
   createLocalizedPathnamesNavigation(routing);
