import { getTranslations } from "next-intl/server";

import { Locale } from "@/i18n/routing";

import { DeliveryForm } from "./delivery-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: "metadata.page-titles" });

   return {
      title: t("request-offers-delivery"),
      description: "",
   };
}

export default async function DeliveryPage() {
   const t = await getTranslations();
   return (
      <>
         <h1 className="text-4xl font-extrabold">{t("request-offers.Delivery")}</h1>
         <DeliveryForm />
      </>
   );
}
