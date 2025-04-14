import { getTranslations } from "next-intl/server";

import { Locale } from "@/i18n/routing";
import { authWithBuyer } from "@/lib/auth/auth";

import { SignInSuggestion } from "../_components/sign-in-suggestion";
import { DeliveryForm } from "./_components/delivery-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: "metadata.page-titles" });

   return {
      title: t("request-offers-delivery"),
      description: "",
   };
}

export default async function DeliveryPage() {
   const [t, session] = await Promise.all([getTranslations(), authWithBuyer()]);
   return (
      <>
         <SignInSuggestion />
         <h1 className="text-4xl font-extrabold text-primary">{t("request-offers.Delivery")}</h1>
         <DeliveryForm session={session} />
      </>
   );
}
