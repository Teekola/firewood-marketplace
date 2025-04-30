import type { MetadataRoute } from "next";

import { env } from "@/env/client";
import { Locale, routing } from "@/i18n/routing";

// Route configuration — central place to manage paths and metadata
const ROUTES: {
   route: keyof (typeof routing)["pathnames"];
   changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
   priority: number;
   lastModified: Date;
}[] = [
   {
      route: "/",
      changeFrequency: "weekly",
      priority: 1,
      lastModified: new Date("2025-04-28"),
   },
   {
      route: "/auth/sign-in",
      changeFrequency: "monthly",
      priority: 0.3,
      lastModified: new Date("2025-04-28"),
   },
   {
      route: "/auth/register",
      changeFrequency: "monthly",
      priority: 0.3,
      lastModified: new Date("2025-04-28"),
   },
];

function generateAlternateLanguagesFromRoute(
   internalRoute: keyof (typeof routing)["pathnames"]
): Record<string, string> {
   const localizedRoute = routing.pathnames[internalRoute];

   const alternates = Object.fromEntries(
      routing.locales.map((locale) => {
         const path = typeof localizedRoute === "string" ? localizedRoute : localizedRoute[locale];

         const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
         return [locale, `${env.NEXT_PUBLIC_BASE_URL}${prefix}${path}`];
      })
   );

   // Add x-default pointing to English
   const englishPath = typeof localizedRoute === "object" ? localizedRoute["en"] : localizedRoute;
   alternates["x-default"] = `${env.NEXT_PUBLIC_BASE_URL}/en${englishPath}`;

   return alternates;
}

function getLocalizedPath(
   internalRoute: keyof (typeof routing)["pathnames"],
   locale: Locale
): string {
   const localizedRoute = routing.pathnames[internalRoute];
   const path = typeof localizedRoute === "string" ? localizedRoute : localizedRoute[locale];
   const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
   return `${env.NEXT_PUBLIC_BASE_URL}${prefix}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
   const entries: MetadataRoute.Sitemap = [];

   for (const { route, changeFrequency, priority, lastModified } of ROUTES) {
      const alternates = generateAlternateLanguagesFromRoute(route);

      for (const locale of routing.locales) {
         entries.push({
            url: getLocalizedPath(route, locale),
            lastModified,
            changeFrequency,
            priority,
            alternates: {
               languages: alternates,
            },
         });
      }
   }

   return entries;
}
