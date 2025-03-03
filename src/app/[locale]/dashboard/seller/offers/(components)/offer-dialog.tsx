"use client";

import { useEffect, useState } from "react";

import { DeliveryMethod } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useFormatter, useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { RelativeTime } from "@/components/relative-time";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { currencyConfigs } from "@/i18n/currencies";
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
   const format = useFormatter();

   function handleClose() {
      router.push(DIALOG_PREVIOUS_ROUTE);
   }

   useEffect(() => {
      if (pathname === DIALOG_ROUTE) setOpen(true);
      if (pathname !== DIALOG_ROUTE) setOpen(false);
   }, [pathname]);

   if (!offer) return null;
   const isHomeDelivery = offer.quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY;
   const currency = currencyConfigs[offer.currency];
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

            <div className="-mt-2 flex flex-col gap-2 text-sm">
               <div>
                  <p className="font-semibold">{t("offer.Price")}</p>
                  <p>
                     {currency.symbolPosition === "before" && currency.symbol}
                     {offer.price} {currency.symbolPosition === "after" && currency.symbol}
                  </p>
               </div>
               <div>
                  <p className="font-semibold">
                     {isHomeDelivery
                        ? t("offer.Earliest delivery date")
                        : t("offer.Earliest pickup date")}
                  </p>

                  <p>
                     {format.dateTime(offer.earliestAvailability, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                     })}
                  </p>
               </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
               {t("quotation-request.Last updated")} <RelativeTime date={offer.updatedAt} />
            </p>

            <div className="mt-8 flex flex-col justify-between gap-2 sm:flex-row">
               <Button asChild className="order-2 w-full sm:order-1" variant="outline">
                  <Link href="/dashboard/seller/offers">{t("actions.Close")}</Link>
               </Button>
               <Button asChild className="order-1 w-full sm:order-2">
                  <Link
                     href={{
                        pathname: "/dashboard/seller/offers/id/[id]/edit",
                        params: { id: offer.id },
                     }}
                  >
                     {t("actions.Edit")}
                  </Link>
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}
