import { env } from "@/env/client";
import { Locale, routing } from "@/i18n/routing";

export function getLocalizedPath(
   internalRoute: keyof (typeof routing)["pathnames"],
   locale: Locale
): string {
   const localizedRoute = routing.pathnames[internalRoute];
   const path = typeof localizedRoute === "string" ? localizedRoute : localizedRoute[locale];
   const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
   return `${env.NEXT_PUBLIC_BASE_URL}${prefix}${path}`;
}
