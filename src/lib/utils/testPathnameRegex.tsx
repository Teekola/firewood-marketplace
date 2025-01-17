import { routing } from "@/i18n/routing";

export function testPathnameRegex({
   paths,
   pathName,
}: {
   paths: string[];
   pathName: string;
}): boolean {
   if (paths.length < 1) return false;
   return RegExp(
      `^(/(${routing.locales.join("|")}))?(${paths.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
      "i"
   ).test(pathName);
}
