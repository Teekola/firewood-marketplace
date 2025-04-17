"use client";

import { ComponentProps } from "react";

import { DeliveryMethod } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";

import { TUseTrackViewing } from "@/components/infinite-list/types";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { RelativeTime } from "@/components/ui/relative-time";
import { OfferDTO } from "@/db/offer";
import { currencyConfigs } from "@/i18n/constants/currencies";
import { Link, Pathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface OfferListItemProps extends ComponentProps<"li"> {
   data: OfferDTO;
   useTrackViewing: TUseTrackViewing;
}

export function OfferListItemRejected({
   data: offer,
   useTrackViewing,
   ...props
}: Readonly<OfferListItemProps>) {
   const t = useTranslations();

   const visibilityRef = useTrackViewing(offer.id);

   const format = useFormatter();
   const earliestAvailability = format.dateTime(offer.earliestAvailability, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
   });

   const hasHomeDelivery = offer.quotationRequest.deliveryMethods.includes(
      DeliveryMethod.HOME_DELIVERY
   );
   const linkPathname: Pathname =
      "/dashboard/buyer/quotation-requests/id/[id]/id/[offerId]/rejected";
   return (
      <li {...props} ref={visibilityRef} className={cn("w-full", props.className)}>
         <Card className={cn("flex flex-col justify-between gap-4 p-4 xs:flex-row")}>
            <div>
               <Link
                  href={{
                     pathname: linkPathname,
                     params: { id: offer.quotationRequestId, offerId: offer.id },
                  }}
               >
                  <CardTitle className="mb-2 text-xl font-bold hover:underline">
                     {offer.price} {currencyConfigs[offer.currency].symbol}
                  </CardTitle>
               </Link>
               {hasHomeDelivery && (
                  <p className="text-sm">
                     {t("offer.Earliest delivery date")} {earliestAvailability}
                  </p>
               )}
               {!hasHomeDelivery && (
                  <p className="text-sm">
                     {t("offer.Earliest pickup date")} {earliestAvailability}
                  </p>
               )}
               <p className="mt-2 text-xs text-foreground-muted">
                  {t("offer.Offer received")} <RelativeTime date={offer.createdAt} />
               </p>
            </div>
            <div className="relative flex flex-col justify-center">
               <Button asChild variant="outline">
                  <Link
                     href={{
                        pathname: linkPathname,
                        params: { id: offer.quotationRequestId, offerId: offer.id },
                     }}
                  >
                     {t("actions.View")}
                  </Link>
               </Button>
            </div>
         </Card>
      </li>
   );
}
