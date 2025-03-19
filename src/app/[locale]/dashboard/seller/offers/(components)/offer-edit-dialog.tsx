"use client";

import { useEffect, useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useRouter } from "@/i18n/routing";

import { ShortQuotationRequestDetails } from "../../../../../../components/quotation-request/short-quotation-request-details";
import {
   OfferForm,
   OfferFormData,
} from "../../quotation-requests/(components)/(make-offer-form)/offer-form";
import { editOffer } from "../actions";

const DIALOG_PREVIOUS_ROUTE = "/dashboard/seller/offers/id/[id]";
const DIALOG_ROUTE = "/dashboard/seller/offers/id/[id]/edit";

export default function OfferEditDialog({
   isOpen,
   offer,
   countryCode,
}: Readonly<{
   isOpen: boolean;
   offer: OfferDTO | null;
   countryCode: string;
}>) {
   const router = useRouter();
   const t = useTranslations();
   const [open, setOpen] = useState(isOpen);
   const pathname = usePathname();

   useEffect(() => {
      if (pathname === DIALOG_ROUTE) setOpen(true);
      if (pathname !== DIALOG_ROUTE) setOpen(false);
   }, [pathname]);

   if (!offer) return null;

   const handleClose = () => {
      router.push({ pathname: DIALOG_PREVIOUS_ROUTE, params: { id: offer.id } });
   };

   const handleSubmit = async (data: OfferFormData) => {
      await editOffer({ id: offer.id, data });
      router.push({ pathname: DIALOG_PREVIOUS_ROUTE, params: { id: offer.id } });
   };

   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent
            disableCloseOnOverlayClick
            onOpenAutoFocus={(e) => e.preventDefault() /** Prevent autofocusing price field */}
         >
            <DialogHeader>
               <DialogTitle className="text-left text-2xl font-bold">
                  {t("offer.Edit Offer")}
               </DialogTitle>
               <DialogDescription className="sr-only">{t("offer.Edit Offer")}</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-full max-h-[80vh]">
               <div className="p-1 pr-4">
                  <div className="mb-4 border-b pb-4">
                     <ShortQuotationRequestDetails quotationRequest={offer.quotationRequest} />
                  </div>

                  <OfferForm
                     countryCode={countryCode}
                     defaultValues={{
                        price: offer.price,
                        currency: offer.currency,
                        earliestAvailability: offer.earliestAvailability,
                        pickupAddress: offer.pickupAddress ?? "",
                        pickupCity: offer.pickupCity ?? "",
                        pickupPostalCode: offer.pickupPostalCode ?? "",
                        pickupCountryCode: offer.pickupCountryCode ?? "",
                        pickupCountryName: offer.pickupCountryName ?? "",
                     }}
                     cancelHref={{ pathname: DIALOG_PREVIOUS_ROUTE, params: { id: offer.id } }}
                     quotationRequestDeliveryMethods={offer.quotationRequest.deliveryMethods}
                     handleSubmit={handleSubmit}
                  />
               </div>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
}
