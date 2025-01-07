import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
   locales: ["fi", "en"], // A list of all locales that are supported
   localePrefix: "as-needed", // only include locale prefix for non-default locales @link https://next-intl-docs.vercel.app/docs/routing#locale-prefix-always
   defaultLocale: "fi", // Used when no locale matches

   // Define all paths, localize when needed
   pathnames: {
      "/": "/",
      "/auth/sign-in": "/auth/sign-in", // This can not be localized
      "/new-user": {
         en: "/new-user",
         fi: "/uusi-kayttaja",
      },
      "/request-offers": {
         en: "/request-offers",
         fi: "/tee-tarjouspyynto",
      },
      "/request-offers/firewood": {
         en: "/request-offers/firewood",
         fi: "/tee-tarjouspyynto/polttopuu",
      },
      "/request-offers/delivery": {
         en: "/request-offers/delivery",
         fi: "/tee-tarjouspyynto/toimitus",
      },
      "/request-offers/contact": {
         en: "/request-offers/contact",
         fi: "/tee-tarjouspyynto/yhteystiedot",
      },
      "/request-offers/submit": {
         en: "/request-offers/submit",
         fi: "/tee-tarjouspyynto/laheta",
      },
   },
});

export type Locale = (typeof routing.locales)[number];

export const localeToLocalizedLanguageName: Record<Locale, string> = {
   en: "English",
   fi: "Suomi",
};

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

export type Pathname = ReturnType<typeof usePathname>;
