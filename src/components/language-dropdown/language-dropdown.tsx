"use client";

import { useParams } from "next/navigation";

import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Locale,
   localeToLocalizedLanguageName,
   routing,
   usePathname,
   useRouter,
} from "@/i18n/routing";

export function LanguageDropdown() {
   const router = useRouter();
   const pathname = usePathname();
   const params = useParams();
   const locale = useLocale();
   const t = useTranslations("aria");

   const changeLocale = (locale: Locale) => {
      if (!locale) return; // Ensure that there is always a value
      // setValue(locale);
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.'
      router.replace({ pathname, params }, { locale });
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
               <Languages className="h-5 w-5" />
               <span className="sr-only">{t("Select language")}</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("Select language")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
               value={locale}
               onValueChange={(locale) => changeLocale(locale as Locale)}
            >
               {routing.locales.map((locale) => (
                  <DropdownMenuRadioItem key={locale} value={locale} className="flex gap-1">
                     {localeToLocalizedLanguageName[locale]}
                     <span className="uppercase">{locale}</span>
                  </DropdownMenuRadioItem>
               ))}
            </DropdownMenuRadioGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
