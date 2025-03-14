"use client";

import { useEffect, useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { OfferDetails } from "@/components/offer/offer-details";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { usePathname, useRouter } from "@/i18n/routing";

import { acceptOffer } from "../actions";
import { RejectOfferDialog } from "./reject-offer-dialog";

const DIALOG_PREVIOUS_ROUTE = "/dashboard/buyer/quotation-requests/id/[id]";
const DIALOG_ROUTE = "/dashboard/buyer/quotation-requests/id/[id]/id/[offerId]";

export default function OfferDialog({
   isOpen,
   offer,
}: Readonly<{
   isOpen: boolean;
   offer: OfferDTO | null;
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

   const handleAccept = async () => {
      await acceptOffer({ offerId: offer.id, quotationRequestId: offer.quotationRequestId });
      router.push({
         pathname: DIALOG_PREVIOUS_ROUTE,
         params: { id: offer.quotationRequest.id },
      });
   };

   const handleClose = () => {
      router.push({
         pathname: DIALOG_PREVIOUS_ROUTE,
         params: { id: offer.quotationRequest.id },
      });
   };
   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="text-left text-2xl font-bold">
                  {t("offer.Offer details")}
               </DialogTitle>
               <DialogDescription className="sr-only">{t("offer.Offer details")}</DialogDescription>
            </DialogHeader>
            <OfferDetails offer={offer} />
            <div className="mt-4 flex max-w-lg flex-col gap-2 sm:flex-row-reverse">
               <Button className="w-full" size="lg" onClick={handleAccept}>
                  {t("actions.Accept offer")}
               </Button>
               <RejectOfferDialog
                  offerId={offer.id}
                  quotationRequestId={offer.quotationRequestId}
                  className="w-full"
               />
            </div>
         </DialogContent>
      </Dialog>
   );
}
