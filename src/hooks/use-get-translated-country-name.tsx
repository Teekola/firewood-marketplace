"use client";

import { useTranslations } from "next-intl";

import { countries } from "@/i18n/constants/countries";

export function useGetTranslatedCountryName() {
   const t = useTranslations();

   function getTranslatedCountryName(countryName?: string | null) {
      if (!countryName) return "";
      return (
         t(`countries.${countries.find((country) => country.label === countryName)?.label}`) ??
         countryName
      );
   }

   return getTranslatedCountryName;
}
