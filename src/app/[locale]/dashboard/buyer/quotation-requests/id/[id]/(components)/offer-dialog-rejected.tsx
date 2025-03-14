"use client";

import { useEffect, useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { OfferDetails } from "@/components/offer/offer-details";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { usePathname, useRouter } from "@/i18n/routing";

import { acceptOffer } from "../actions";

const DIALOG_PREVIOUS_ROUTE = "/dashboard/buyer/quotation-requests/id/[id]/rejected-offers";
const DIALOG_ROUTE = "/dashboard/buyer/quotation-requests/id/[id]/id/[offerId]/rejected";

export default function OfferDialogRejected({
   isOpen,
   offer,
}: Readonly<{
   isOpen: boolean;
   offer: OfferDTO | null;
}>) {
   const router = useRouter();
   const t = useTranslations();
   const [open, setOpen] = useState(isOpen);
   const [isAccepting, setIsAccepting] = useState(false);
   const pathname = usePathname();

   useEffect(() => {
      if (pathname === DIALOG_ROUTE) setOpen(true);
      if (pathname !== DIALOG_ROUTE) setOpen(false);
   }, [pathname]);

   if (!offer) return null;

   const handleAccept = async () => {
      setIsAccepting(true);
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
               {!isAccepting && (
                  <Button className="w-full" size="lg" onClick={handleAccept}>
                     {t("actions.Accept offer")}
                  </Button>
               )}
               {isAccepting && (
                  <ButtonLoading
                     className="w-full"
                     size="lg"
                     label={t("loading.Accepting offer")}
                  />
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}
