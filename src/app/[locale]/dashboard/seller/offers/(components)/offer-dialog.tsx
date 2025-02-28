"use client";

import { useEffect, useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Link, usePathname, useRouter } from "@/i18n/routing";

import { ShortQuotationRequestDetails } from "../../quotation-requests/(components)/short-quotation-request-details";

const DIALOG_PREVIOUS_ROUTE = "/dashboard/seller/offers";
const DIALOG_ROUTE = "/dashboard/seller/offers/id/[id]";

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

   function handleClose() {
      router.push(DIALOG_PREVIOUS_ROUTE);
   }

   useEffect(() => {
      if (pathname === DIALOG_ROUTE) setOpen(true);
      if (pathname !== DIALOG_ROUTE) setOpen(false);
   }, [pathname]);

   if (!offer) return null;
   return (
      <Dialog open={open} onOpenChange={handleClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="text-left text-2xl font-bold">
                  {t("offer.Offer details")}
               </DialogTitle>
               <DialogDescription className="sr-only">{t("offer.Offer details")}</DialogDescription>
            </DialogHeader>
            <ShortQuotationRequestDetails quotationRequest={offer.quotationRequest} />

            <Button asChild>
               <Link
                  href={{
                     pathname: "/dashboard/seller/offers/id/[id]/edit",
                     params: { id: offer.id },
                  }}
               >
                  {t("actions.Edit")}
               </Link>
            </Button>
         </DialogContent>
      </Dialog>
   );
}
