import { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";

import { SignInOptions } from "@/components/auth/sign-in-options";
import { Link, Locale, routing } from "@/i18n/routing";

export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
   params,
}: {
   params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: "metadata" });

   return {
      title: t("page-titles.sign-in"),
      description: t("page-descriptions.sign-in"),
   };
}

export default async function SignInPage({
   params,
   searchParams,
}: Readonly<{
   params: Promise<{ locale: Locale }>;
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
   const [{ locale }, t, search] = await Promise.all([
      params,
      getTranslations("auth"),
      searchParams,
   ]);
   setRequestLocale(locale);

   return (
      <>
         <SignInOptions />

         <p className="mt-5 text-sm">
            {t("New user")}
            {"? "}
            <Link
               href={{ pathname: "/auth/register", query: search }}
               className="cursor-pointer underline"
            >
               {t("Register here")}
            </Link>
         </p>
      </>
   );
}
