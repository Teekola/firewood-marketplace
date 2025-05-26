import { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { RegisterOptions } from "@/components/auth/register-options";
import { Link, Locale } from "@/i18n/routing";
import { getLocalizedPath } from "@/i18n/utils/get-localized-path";

export async function generateMetadata({
   params,
}: {
   params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: "metadata" });

   return {
      title: t("page-titles.register"),
      description: t("page-descriptions.register"),
      alternates: {
         canonical: getLocalizedPath("/auth/register", locale),
      },
   };
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
