import type { MetadataRoute } from "next";

import { env } from "@/env/client";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
   return [
      {
         url: env.NEXT_PUBLIC_BASE_URL,
         lastModified: new Date("2025-04-28"),
         changeFrequency: "weekly",
         priority: 1,
         alternates: {
            languages: Object.fromEntries(
               routing.locales.map((locale) => {
                  if (locale === routing.defaultLocale) {
                     return [routing.defaultLocale, env.NEXT_PUBLIC_BASE_URL];
                  }
                  return [locale, `${env.NEXT_PUBLIC_BASE_URL}/${locale}`];
               })
            ),
         },
      },
   ];
}
