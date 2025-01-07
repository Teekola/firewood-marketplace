import { getTranslations, setRequestLocale } from "next-intl/server";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Locale, routing } from "@/i18n/routing";

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
      <div className="mx-auto flex h-screen max-w-screen-sm flex-col items-center justify-center gap-4">
         <h1 className="h2">{t("Sign In")}</h1>
         <GoogleSignInButton />
      </div>
   );
}
