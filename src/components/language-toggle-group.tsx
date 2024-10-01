"use client";

import { useParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePathname, useRouter } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export function LanguageToggleGroup() {
   const router = useRouter();
   const pathname = usePathname();
   const params = useParams();
   const locale = useLocale();
   const t = useTranslations("aria");

   // Function to change locale
   const changeLocale = (locale: (typeof routing.locales)[number]) => {
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      router.replace({ pathname, params }, { locale });
   };

   return (
      <ToggleGroup
         type="single"
         defaultValue={locale}
         onValueChange={changeLocale}
         aria-label={t("Select language")}
      >
         {routing.locales.map((locale) => (
            <ToggleGroupItem key={locale} value={locale} className="uppercase">
               {locale}
            </ToggleGroupItem>
         ))}
      </ToggleGroup>
   );
}
