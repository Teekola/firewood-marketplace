import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { getQuotationRequest } from "@/app/db/quotation-request";

import QuotationRequestDetails from "../../(components)/quotation-request-details";

export default async function QuotationRequestPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const quotationRequest = await getQuotationRequest({ id });
   const t = await getTranslations("dashboard");

   if (!quotationRequest) return notFound();

   return (
      <div className="w-full space-y-3">
         <h3 className="text-2xl font-bold">{t("Quotation request details")}</h3>
         <QuotationRequestDetails quotationRequest={quotationRequest} />
      </div>
   );
}
