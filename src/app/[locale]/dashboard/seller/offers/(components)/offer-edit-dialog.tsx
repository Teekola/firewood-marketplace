"use client";

import { useEffect, useState } from "react";

import { DeliveryMethod } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { usePathname, useRouter } from "@/i18n/routing";

import { MakeOfferForm } from "../../quotation-requests/(components)/(make-offer-form)/make-offer-form";
import { ShortQuotationRequestDetails } from "../../quotation-requests/(components)/short-quotation-request-details";

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

   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent disableCloseOnOverlayClick>
            <DialogHeader>
               <DialogTitle className="text-left text-2xl font-bold">
                  {t("offer.Edit Offer")}
               </DialogTitle>
               <DialogDescription className="sr-only">{t("offer.Edit Offer")}</DialogDescription>
            </DialogHeader>
            <ShortQuotationRequestDetails quotationRequest={offer.quotationRequest} />

            <MakeOfferForm
               countryCode={countryCode}
               quotationRequestId={offer.quotationRequestId}
               defaultValues={{
                  price: offer.price,
                  currency: offer.currency,
                  earliestAvailability: offer.earliestAvailability,
               }}
               cancelHref={{ pathname: DIALOG_PREVIOUS_ROUTE, params: { id: offer.id } }}
               isHomeDelivery={
                  offer.quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY
               }
            />
         </DialogContent>
      </Dialog>
   );
}
