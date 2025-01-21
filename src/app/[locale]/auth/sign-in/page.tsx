import { getTranslations, setRequestLocale } from "next-intl/server";

import { SignInOptions } from "@/components/auth/sign-in-options";
import { Logo } from "@/components/logo";
import { Link, Locale, routing } from "@/i18n/routing";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function SignInPage({
   params,
}: Readonly<{ params: Promise<{ locale: Locale }> }>) {
   const { locale } = await params;
   setRequestLocale(locale);

   const t = await getTranslations("auth");
   return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-secondary">
         <div className="flex w-full max-w-screen-xs flex-col items-center gap-5 rounded bg-card px-5 py-20 shadow">
            <Logo className="-mt-5 mb-5 text-xl" />
            <h1 className="h2">{t("Sign In")}</h1>
            <SignInOptions />

            <p className="mt-5 text-sm">
               {t("New user")}
               {"? "}
               <Link href="/auth/register" className="cursor-pointer underline">
                  {t("Register here")}
               </Link>
            </p>
         </div>
      </div>
   );
}
