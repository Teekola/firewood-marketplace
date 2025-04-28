import type { MetadataRoute } from "next";

import { env } from "@/env/client";
import { routing } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
   const disallowRoutes: (keyof typeof routing.pathnames)[] = ["/dashboard"];

   const getLocalizedPaths = (path: keyof typeof routing.pathnames) => {
      if (typeof routing.pathnames[path] !== "string") {
         return Object.values(routing.pathnames[path]);
      }
      return [path];
   };

   const disallowPathsWithoutPrefix: string[] = [];

   disallowRoutes.forEach((path) => {
      const localizedPaths = getLocalizedPaths(path);
      disallowPathsWithoutPrefix.push(...localizedPaths);
   });

   const disallowPaths = [...disallowPathsWithoutPrefix];

   routing.locales.forEach((locale) => {
      disallowPathsWithoutPrefix.forEach((path) => {
         disallowPaths.push(`/${locale}${path}`);
      });
   });

   return {
      rules: [
         {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", ...disallowPaths],
         },
      ],
      sitemap: `${env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
   };
}
