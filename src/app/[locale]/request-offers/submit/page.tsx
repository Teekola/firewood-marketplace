import { getTranslations } from "next-intl/server";

import { Locale } from "@/i18n/routing";

import { Preview } from "./preview";
import { SubmitForm } from "./submit-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: "metadata.page-titles" });

   return {
      title: t("request-offers-submit"),
      description: "",
   };
}

export default async function SubmitPage() {
   const t = await getTranslations();
   return (
      <>
         <h1 className="text-4xl font-extrabold">{t("request-offers.Submit")}</h1>
         <div className="mt-4 flex h-full max-w-lg flex-col gap-4">
            <Preview />
            <SubmitForm />
         </div>
      </>
   );
}
