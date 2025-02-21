import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { getQuotationRequest } from "@/app/db/quotation-request";

export default async function MakeOfferPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const quotationRequest = await getQuotationRequest({ id });
   const t = await getTranslations();

   if (!quotationRequest) return notFound();

   return (
      <div className="w-full space-y-3">
         <h3 className="text-2xl font-bold">{t("quotation-request.Make an Offer")}</h3>
      </div>
   );
}
