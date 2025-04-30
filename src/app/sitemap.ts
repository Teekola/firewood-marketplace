import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getLocalizedPath } from "@/i18n/utils/get-localized-path";

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
   const alternates = Object.fromEntries(
      routing.locales.map((locale) => {
         const localizedRoute = getLocalizedPath(internalRoute, locale);
         return [locale, localizedRoute];
      })
   );

   // Add x-default pointing to English
   alternates["x-default"] = getLocalizedPath(internalRoute, "en");

   return alternates;
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
