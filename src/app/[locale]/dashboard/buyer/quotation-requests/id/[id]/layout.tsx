import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { QuotationRequestTitle } from "@/app/[locale]/dashboard/(components)/quotation-request-title";
import { TabLink } from "@/app/[locale]/dashboard/seller/quotation-requests/(tabs)/tab-link";
import { getQuotationRequestWithAcceptedOffer } from "@/app/db/quotation-request";
import { ShortQuotationRequestDetails } from "@/components/quotation-request/short-quotation-request-details";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
import { Locale } from "@/i18n/routing";

import { AcceptedOffer } from "./(components)/accepted-offer";
import { DeleteQuotationRequestDialog } from "./(components)/delete-quotation-request-dialog";
import { OfferListTitle } from "./(components)/offer-list-title";

export default async function BuyerQuotationRequestLayout({
   children,
   params,
   modal,
}: Readonly<{
   children: React.ReactNode;
   modal: React.ReactNode;
   params: Promise<{ id: string; locale: Locale }>;
}>) {
   const { id } = await params;
   const [{ quotationRequest, acceptedOffer }, t] = await Promise.all([
      getQuotationRequestWithAcceptedOffer({ id }),
      getTranslations(),
   ]);

   if (!quotationRequest) return notFound();
   return (
      <div className="flex w-full flex-col gap-2">
         <QuotationRequestTitle quotationRequest={quotationRequest} as="h1" className="h3" />

         {acceptedOffer && <AcceptedOffer offer={acceptedOffer} />}
         <div className="mt-2 flex items-start gap-2">
            <Accordion type="single" collapsible className="w-full">
               <AccordionItem value="show-details" className="rounded border px-3 shadow-sm">
                  <AccordionTrigger className="max-h-[38px] font-semibold">
                     {t("quotation-request.Quotation Request Details")}
                  </AccordionTrigger>

                  <AccordionContent>
                     <ShortQuotationRequestDetails quotationRequest={quotationRequest} />
                  </AccordionContent>
               </AccordionItem>
            </Accordion>
            <DeleteQuotationRequestDialog quotationRequestId={quotationRequest.id} />
         </div>

         <OfferListTitle className="mt-5" />
         <div className="flex max-w-lg justify-between rounded-md bg-muted p-1">
            <TabLink
               href={{ pathname: "/dashboard/buyer/quotation-requests/id/[id]", params: { id } }}
               label={t("buyer.Active")}
            />
            <TabLink
               href={{
                  pathname: "/dashboard/buyer/quotation-requests/id/[id]/rejected-offers",
                  params: { id },
               }}
               label={t("buyer.Rejected")}
            />
         </div>

         {children}
         {modal}
      </div>
   );
}
