import type { MetadataRoute } from "next";

import { env } from "@/env/client";
import { routing } from "@/i18n/routing";

function generateAlternateLanguagesFromRoute(
   internalRoute: keyof (typeof routing)["pathnames"]
): Record<string, string> {
   const localizedRoute = routing.pathnames[internalRoute];

   const alternates = Object.fromEntries(
      routing.locales.map((locale) => {
         let path: string;

         if (typeof localizedRoute === "string") {
            path = localizedRoute;
         } else if (typeof localizedRoute === "object") {
            path = localizedRoute[locale];
            if (!path) {
               throw new Error(
                  `Missing localized path for route ${internalRoute} and locale ${locale}`
               );
            }
         } else {
            throw new Error(`Unknown route format for: ${internalRoute}`);
         }

         const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
         return [locale, `${env.NEXT_PUBLIC_BASE_URL}${prefix}${path}`];
      })
   );

   // Add x-default pointing to English
   const englishPath = typeof localizedRoute === "object" ? localizedRoute["en"] : localizedRoute;
   alternates["x-default"] = `${env.NEXT_PUBLIC_BASE_URL}/en${englishPath}`;

   return alternates;
}

function getDefaultLocalePath(internalRoute: keyof (typeof routing)["pathnames"]): string {
   const localizedRoute = routing.pathnames[internalRoute];
   const defaultLocale = routing.defaultLocale;
   const path = typeof localizedRoute === "string" ? localizedRoute : localizedRoute[defaultLocale];

   return `${env.NEXT_PUBLIC_BASE_URL}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
   return [
      {
         url: getDefaultLocalePath("/"),
         lastModified: new Date("2025-04-28"),
         changeFrequency: "weekly",
         priority: 1,
         alternates: {
            languages: generateAlternateLanguagesFromRoute("/"),
         },
      },
      {
         url: getDefaultLocalePath("/auth/sign-in"),
         lastModified: new Date("2025-04-28"),
         changeFrequency: "monthly",
         priority: 0.3,
         alternates: {
            languages: generateAlternateLanguagesFromRoute("/auth/sign-in"),
         },
      },
      {
         url: getDefaultLocalePath("/auth/register"),
         lastModified: new Date("2025-04-28"),
         changeFrequency: "monthly",
         priority: 0.3,
         alternates: {
            languages: generateAlternateLanguagesFromRoute("/auth/register"),
         },
      },
   ];
}
