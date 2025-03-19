"use client";

import { useEffect, useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useRouter } from "@/i18n/routing";

import { OfferForm, OfferFormData } from "../(components)/(make-offer-form)/offer-form";
import { SellerLocation } from "../../../../../../../prisma/prismaClientExtensions";
import { ShortQuotationRequestDetails } from "../../../../../../components/quotation-request/short-quotation-request-details";
import { createOffer } from "../actions";

const DIALOG_PREVIOUS_ROUTE = "/dashboard/seller/quotation-requests/id/[id]";
const DIALOG_ROUTE = "/dashboard/seller/quotation-requests/id/[id]/make-offer";

export default function MakeOfferDialog({
   isOpen,
   quotationRequest,
   sellerLocation,
   autoFocus,
}: Readonly<{
   isOpen: boolean;
   quotationRequest: QuotationRequest | null;
   sellerLocation: SellerLocation;
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
            className="pl-4 pr-0"
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
            </DialogHeader>

            <ScrollArea className="h-full max-h-[80vh]">
               <div className="p-1 pr-4">
                  <div className="mb-4 border-b pb-4">
                     <ShortQuotationRequestDetails quotationRequest={quotationRequest} />
                  </div>
                  <OfferForm
                     defaultValues={{
                        pickupCountryCode: sellerLocation.countryCode,
                        pickupCountryName: sellerLocation.countryName,
                        pickupCity: sellerLocation.city,
                        pickupPostalCode: sellerLocation.postalCode,
                        pickupAddress: sellerLocation.address ?? "",
                     }}
                     cancelHref={{
                        pathname: DIALOG_PREVIOUS_ROUTE,
                        params: { id: quotationRequest.id },
                     }}
                     countryCode={sellerLocation.countryCode}
                     quotationRequestDeliveryMethods={quotationRequest.deliveryMethods}
                     handleSubmit={handleSubmit}
                  />
               </div>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   );
}
