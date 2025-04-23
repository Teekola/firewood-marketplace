import { Locale, routing } from "@/i18n/routing";

// Escape the slashes (/) and ensure the regex pattern is valid
function regexifyPath(path: string): RegExp {
   // Escape slashes and ensure dynamic segments like [id] are properly handled
   const escaped = path
      .replace(/\//g, "\\/") // Escape the / characters
      .replace(/\[.*?\]/g, "(.+)"); // Replace dynamic segments [id] with .+
   return new RegExp(`^${escaped}$`);
}

/**
 * Gets all localized pages for routes based on routing.pathnames
 * Supports simple regex pattern of .* in the string
 * returns localized pages in a Set of strings
 */
export function getLocalizedPages(routes: string[]) {
   const localizedPages = new Set<string>();
   const { locales, defaultLocale } = routing;
   const pathnames: Record<string, string | Record<Locale, string>> = routing.pathnames;

   const isRegexRoute = (route: string) => route.includes(".*");
   const staticRoutes = routes.filter((route) => !isRegexRoute(route));
   const regexRoutes = routes.filter(isRegexRoute);

   const addLocalizedPath = (path: string) => {
      localizedPages.add(path);
      locales.forEach((locale) => {
         if (locale !== defaultLocale) {
            localizedPages.add(`/${locale}${path}`);
         }
      });
   };

   const processPath = (localized: string | Record<Locale, string>) => {
      if (typeof localized === "string") {
         addLocalizedPath(localized);
      } else {
         for (const [locale, path] of Object.entries(localized)) {
            localizedPages.add(path);
            if (locale !== defaultLocale) {
               localizedPages.add(`/${locale}${path}`);
            }
         }
      }
   };

   staticRoutes.forEach((route) => {
      const localized = pathnames[route];
      if (localized) processPath(localized);
   });

   regexRoutes.forEach((pattern) => {
      const regex = regexifyPath(pattern);
      for (const [staticPath, localized] of Object.entries(pathnames)) {
         if (regex.test(staticPath)) {
            processPath(localized);
         }
      }
   });

   return localizedPages;
}
