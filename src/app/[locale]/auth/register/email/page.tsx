import { getTranslations, setRequestLocale } from "next-intl/server";

import { BackButtonLink } from "@/components/ui/back-button-link";
import { Logo } from "@/components/ui/logo";
import { Link, Locale, routing } from "@/i18n/routing";

import { EmailPasswordRegistrationForm } from "./email-password-registration-form";

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
            <Logo className="-mt-5 mb-5 text-xl" />

            <EmailPasswordRegistrationForm />
            <div className="mt-6 flex flex-wrap-reverse items-center gap-6 xs:gap-2">
               <BackButtonLink label={t("actions.Back")} className="self-start" />
               <p className="text-right text-sm">
                  {t("auth.Already have an account")}
                  {"? "}
                  <Link
                     href={{ pathname: "/auth/sign-in", query: search }}
                     className="cursor-pointer underline"
                  >
                     {t("auth.Sign In")}
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
