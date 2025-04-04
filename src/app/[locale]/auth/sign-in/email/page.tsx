import { getTranslations, setRequestLocale } from "next-intl/server";

import { BackButtonLink } from "@/components/ui/back-button-link";
import { Logo } from "@/components/ui/logo";
import { Link, Locale, routing } from "@/i18n/routing";

import { EmailPasswordSignInForm } from "./email-password-sign-in-form";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function RegisterWithEmailPage({
   params,
   searchParams,
}: Readonly<{
   params: Promise<{ locale: Locale }>;
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
   const [{ locale }, search] = await Promise.all([params, searchParams]);
   setRequestLocale(locale);

   const t = await getTranslations();
   return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-secondary">
         <div className="flex w-full max-w-screen-xs flex-col items-center gap-5 rounded bg-card px-5 pb-10 pt-20 shadow">
            <div className="flex flex-col items-center">
               <Logo className="-mt-5 mb-5 text-xl" />
               <h1 className="h2">{t("auth.Sign In")}</h1>
            </div>
            <EmailPasswordSignInForm />
            <div className="mt-6 flex flex-wrap-reverse items-center gap-6 xs:gap-2">
               <BackButtonLink label={t("actions.Back")} className="self-start" />
               <p className="text-right text-sm">
                  {t("auth.New user")}
                  {"? "}
                  <Link
                     href={{ pathname: "/auth/register", query: search }}
                     className="cursor-pointer underline"
                  >
                     {t("auth.Register here")}
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
