"use client";

import { useTranslations } from "next-intl";

import { countries } from "@/i18n/constants/countries";

export function useGetTranslatedCountryName() {
   const t = useTranslations();

   function getTranslatedCountryName(countryName?: string | null) {
      if (!countryName) return "";
      return (
         t(
            // This added after next-intl v4 update
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            `countries.${countries.find((country) => country.label === countryName)?.label}` as any
         ) ?? countryName
      );
   }

   return getTranslatedCountryName;
}
