"use client";

import { useEffect, useState } from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { OfferDetails } from "@/components/offer/offer-details";
import { RelativeTime } from "@/components/relative-time";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Link, usePathname, useRouter } from "@/i18n/routing";

import { DeleteOfferDialog } from "./delete-offer-dialog";

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
         <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
               <DialogTitle className="text-left text-2xl font-bold">
                  {t("offer.Offer details")}
               </DialogTitle>
               <DialogDescription className="sr-only">{t("offer.Offer details")}</DialogDescription>
            </DialogHeader>

            <OfferDetails offer={offer} showAddress />

            <p className="mt-2 text-xs text-muted-foreground">
               {t("quotation-request.Last updated")} <RelativeTime date={offer.updatedAt} />
            </p>

            <div className="mt-8 flex flex-col justify-between gap-2 sm:flex-row">
               <Button asChild className="order-2 w-full sm:order-1" variant="outline" size="lg">
                  <Link href="/dashboard/seller/offers">{t("actions.Close")}</Link>
               </Button>

               <div className="order-1 flex gap-2 sm:order-2">
                  {offer.isActive && (
                     <Button asChild className="w-full" size="lg">
                        <Link
                           href={{
                              pathname: "/dashboard/seller/offers/id/[id]/edit",
                              params: { id: offer.id },
                           }}
                        >
                           <EditIcon className="mr-2 h-4 w-4 stroke-primary-foreground" />
                           {t("actions.Edit")}
                        </Link>
                     </Button>
                  )}
                  <DeleteOfferDialog
                     offerId={offer.id}
                     quotationRequestId={offer.quotationRequestId}
                     className="order-3"
                  />
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
