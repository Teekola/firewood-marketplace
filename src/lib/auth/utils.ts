import { routing } from "@/i18n/routing";

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

   // Pre-compile the regex pattern for all routes with dynamic segments
   const regexRoutes = routes.filter((route) => route.includes(".*"));
   const staticRoutes = routes.filter((route) => !route.includes(".*"));

   const pathnames: Record<string, string | Record<string, string>> = routing.pathnames;

   // Process static routes
   staticRoutes.forEach((route) => {
      const localizedPaths = pathnames[route];
      if (localizedPaths) {
         // If it's a simple static path, add the localized paths
         if (typeof localizedPaths === "string") {
            localizedPages.add(localizedPaths);

            // Add prefixed versions for non-default locales (if missing)
            routing.locales.forEach((locale) => {
               if (locale !== routing.defaultLocale) {
                  localizedPages.add(`/${locale}${localizedPaths}`);
               }
            });
         } else {
            // Add both localized paths (for different locales)
            Object.values(localizedPaths).forEach((localizedPath) => {
               localizedPages.add(localizedPath);
            });
         }
      }
   });

   // Process regex routes (those that include ".*")
   regexRoutes.forEach((route) => {
      const regex = regexifyPath(route); // Create the regex pattern once
      // Check if any static paths match the regex
      Object.keys(pathnames).forEach((staticPath) => {
         // If the regex matches a static path, add localized paths to set
         if (regex.test(staticPath)) {
            const localizedPaths = pathnames[staticPath];
            if (localizedPaths) {
               if (typeof localizedPaths === "string") {
                  localizedPages.add(localizedPaths);
               } else {
                  Object.values(localizedPaths).forEach((localizedPath) => {
                     localizedPages.add(localizedPath);
                  });
               }
            }
         }
      });
   });

   return localizedPages;
}
