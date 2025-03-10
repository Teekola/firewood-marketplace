import { routing } from "@/i18n/routing";

export function testPathnameRegex({
   paths,
   pathName,
}: {
   paths: string[];
   pathName: string;
}): boolean {
   if (paths.length < 1) return false;

   // Replace dynamic segments like [id] with .+ to match any value
   const regexPaths = paths.map(
      (p) => p.replace(/\[.*?\]/g, ".+") // Match dynamic segments with .+
   );

   // Build the full regular expression, including locale support
   const regexPattern = `^(/(${routing.locales.join("|")}))?(${regexPaths
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`;

   return new RegExp(regexPattern, "i").test(pathName);
}
