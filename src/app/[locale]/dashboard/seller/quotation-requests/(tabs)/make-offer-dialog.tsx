"use client";

import { useEffect, useState } from "react";

import { DeliveryMethod } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { usePathname, useRouter } from "@/i18n/routing";

import { OfferForm, OfferFormData } from "../(components)/(make-offer-form)/offer-form";
import { ShortQuotationRequestDetails } from "../(components)/short-quotation-request-details";
import { createOffer } from "../actions";

const DIALOG_PREVIOUS_ROUTE = "/dashboard/seller/quotation-requests/id/[id]";
const DIALOG_ROUTE = "/dashboard/seller/quotation-requests/id/[id]/make-offer";

export default function MakeOfferDialog({
   isOpen,
   quotationRequest,
   countryCode,
   autoFocus,
}: Readonly<{
   isOpen: boolean;
   quotationRequest: QuotationRequest | null;
   countryCode: string;
   autoFocus?: boolean;
}>) {
   const router = useRouter();
   const t = useTranslations();
   const [open, setOpen] = useState(isOpen);
   const pathname = usePathname();

   useEffect(() => {
      if (pathname === DIALOG_ROUTE) setOpen(true);
      if (pathname !== DIALOG_ROUTE) setOpen(false);
   }, [pathname]);

   if (!quotationRequest) return null;

   const handleClose = () => {
      router.push({ pathname: DIALOG_PREVIOUS_ROUTE, params: { id: quotationRequest.id } });
   };

   const handleSubmit = async (data: OfferFormData) => {
      await createOffer({ quotationRequestId: quotationRequest.id, ...data });
      router.push("/dashboard/seller/quotation-requests");
   };

   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent
            disableCloseOnOverlayClick
            {...(!autoFocus && { onOpenAutoFocus: (e) => e.preventDefault() })}
         >
            <DialogHeader>
               <DialogTitle className="text-left text-2xl font-bold">
                  {t("quotation-request.Make an Offer")}
               </DialogTitle>
               <DialogDescription className="sr-only">
                  {t("offer.Fill in the form to make an offer")}
               </DialogDescription>
               <div className="border-b pb-4">
                  <ShortQuotationRequestDetails quotationRequest={quotationRequest} />
               </div>
               <OfferForm
                  cancelHref={{
                     pathname: DIALOG_PREVIOUS_ROUTE,
                     params: { id: quotationRequest.id },
                  }}
                  countryCode={countryCode}
                  isHomeDelivery={quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY}
                  handleSubmit={handleSubmit}
               />
            </DialogHeader>
         </DialogContent>
      </Dialog>
   );
}
