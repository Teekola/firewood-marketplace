import { getTranslations, setRequestLocale } from "next-intl/server";

import { RegisterOptions } from "@/components/auth/register-options";
import { Link, Locale, routing } from "@/i18n/routing";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function RegisterPage({
   params,
   searchParams,
}: Readonly<{
   params: Promise<{ locale: Locale }>;
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
   const [{ locale }, search] = await Promise.all([params, searchParams]);
   setRequestLocale(locale);

   const t = await getTranslations("auth");
   return (
      <>
         <RegisterOptions />
         <p className="mt-5 text-right text-sm">
            {t("Already have an account")}
            {"? "}
            <Link
               href={{ pathname: "/auth/sign-in", query: search }}
               className="cursor-pointer underline"
            >
               {t("Sign In")}
            </Link>
         </p>
      </>
   );
}
