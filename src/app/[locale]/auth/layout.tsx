import { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { LanguageDropdown } from "@/components/language-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { Locale, routing } from "@/i18n/routing";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
   robots: {
      index: false,
      follow: true,
   },
};

export default async function AuthLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const [{ locale }] = await Promise.all([params]);
   setRequestLocale(locale);

   return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
         <div className="flex w-full max-w-screen-xs flex-col items-center gap-5 rounded bg-card px-5 py-20 shadow">
            {children}
         </div>
         <div className="flex w-full max-w-screen-xs justify-end gap-2">
            <ThemeToggle />
            <LanguageDropdown />
         </div>
      </div>
   );
}
