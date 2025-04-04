import { routing } from "@/i18n/routing";

function regexifyPath(path: string): RegExp {
   const escaped = path.replace(/\//g, "\\/"); // replace / with \/
   return new RegExp(escaped);
}
/**
 *
 * @returns array of all localized pathnames
 */
export function getLocalizedPages(routes: string[]) {
   const pathnames = routes.flatMap((route) => {
      const regex = regexifyPath(route);
      return Object.keys(routing.pathnames)
         .filter((path) => regex.test(path))
         .flatMap((matchedPath) => {
            // Convert dynamic paths to match any value (e.g., replace [id] with .+)
            const regexPath = matchedPath.replace(/\[.*?\]/g, ".+");
            return Object.values(routing.pathnames[matchedPath as keyof typeof routing.pathnames])
               .map((localizedPath) => {
                  // Convert localized paths similarly if they have dynamic segments
                  return localizedPath.replace(/\[.*?\]/g, ".+");
               })
               .concat(regexPath);
         });
   });
   return pathnames;
}
