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
      "/auth/register": {
         en: "/register",
         fi: "/rekisteroidy",
      },
      "/dashboard": {
         en: "/dashboard",
         fi: "/paneeli",
      },
      "/dashboard/seller": {
         en: "/seller",
         fi: "/myyja",
      },
      "/dashboard/seller/dashboard": {
         en: "/seller/dashboard",
         fi: "/myyja/paneeli",
      },
      "/dashboard/seller/profile": {
         en: "/seller/profile",
         fi: "/myyja/profiili",
      },
      "/dashboard/seller/location": {
         en: "/seller/location",
         fi: "/myyja/sijainti",
      },
      "/dashboard/seller/quotation-requests": {
         en: "/seller/quotation-requests",
         fi: "/myyja/tarjouspyynnot",
      },
      "/dashboard/seller/quotation-requests/id/[id]": {
         en: "/seller/quotation-requests/id/[id]",
         fi: "/myyja/tarjouspyynnot/id/[id]",
      },
      "/dashboard/seller/quotation-requests/id/[id]/make-offer": {
         en: "/seller/quotation-requests/id/[id]/make-offer",
         fi: "/myyja/tarjouspyynnot/id/[id]/tee-tarjous",
      },
      "/dashboard/seller/quotation-requests/rejected": {
         en: "/seller/quotation-requests/rejected",
         fi: "/myyja/tarjouspyynnot/hylatyt",
      },
      "/dashboard/seller/offers": {
         en: "/seller/offers",
         fi: "/myyja/tarjoukset",
      },
      "/dashboard/seller/offers/id/[id]": {
         en: "/seller/offers/id/[id]",
         fi: "/myyja/tarjoukset/id/[id]",
      },
      "/dashboard/seller/offers/id/[id]/edit": {
         en: "/seller/offers/id/[id]/edit",
         fi: "/myyja/tarjoukset/id/[id]/muokkaa",
      },
      "/dashboard/buyer": {
         en: "/buyer-dashboard",
         fi: "/ostajan-paneeli",
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
      "/request-offers/submitting": {
         en: "/request-offers/submitting",
         fi: "/tee-tarjouspyynto/lahetetaan",
      },
      "/request-offers/submitted": {
         en: "/request-offers/submitted",
         fi: "/tee-tarjouspyynto/lahetetty",
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
export type StaticPathname = Exclude<
   keyof typeof routing.pathnames,
   `${string}[${string}]${string}`
>;
