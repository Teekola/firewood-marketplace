import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { routing } from "@/i18n/routing";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function testPathnameRegex({
   paths,
   pathName,
}: {
   paths: string[];
   pathName: string;
}): boolean {
   return RegExp(
      `^(/(${routing.locales.join("|")}))?(${paths.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
      "i"
   ).test(pathName);
}
