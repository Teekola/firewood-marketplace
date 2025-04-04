import { getTranslations } from "next-intl/server";

import { Locale } from "@/i18n/routing";
import { authWithBuyer } from "@/lib/auth/auth";

import { SignInSuggestion } from "../../(components)/sign-in-suggestion";
import { ContactForm } from "./contact-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: "metadata.page-titles" });

   return {
      title: t("request-offers-contact"),
      description: "",
   };
}

export default async function ContactPage() {
   const [t, session] = await Promise.all([getTranslations(), authWithBuyer()]);
   return (
      <>
         <SignInSuggestion />
         <h1 className="text-4xl font-extrabold">{t("request-offers.Contact")}</h1>
         <ContactForm session={session} />
      </>
   );
}
