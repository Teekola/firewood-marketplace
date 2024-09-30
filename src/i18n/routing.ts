import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { env } from "@/env/server";

const isProduction = env.NODE_ENV === "production";

export const routing = defineRouting({
   // A list of all locales that are supported
   locales: ["fi", "en"],

   // Used when no locale matches
   defaultLocale: "en",
   domains: isProduction
      ? [
           {
              locales: ["fi", "en"],
              domain: "klapitori.fi",
              defaultLocale: "fi",
           },
        ]
      : [],
   // Define all paths, localize when needed
   pathnames: {
      "/": "/",
      "/auth/sign-in": "/auth/sign-in", // This can not be localized
   },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
   createLocalizedPathnamesNavigation(routing);
