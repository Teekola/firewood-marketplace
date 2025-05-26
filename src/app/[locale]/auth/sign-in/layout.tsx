import { getTranslations, setRequestLocale } from "next-intl/server";

import { Logo } from "@/components/ui/logo";
import { Locale } from "@/i18n/routing";

export default async function SignInLayout({
   children,
   params,
}: Readonly<{
   children: React.ReactNode;
   params: Promise<{ locale: Locale }>;
}>) {
   const { locale } = await params;
   setRequestLocale(locale);
   const t = await getTranslations();

   return (
      <>
         <div className="flex flex-col items-center">
            <Logo className="-mt-5 mb-5 text-xl" />
            <h1 className="h2">{t("auth.Sign In")}</h1>
         </div>
         {children}
      </>
   );
}
