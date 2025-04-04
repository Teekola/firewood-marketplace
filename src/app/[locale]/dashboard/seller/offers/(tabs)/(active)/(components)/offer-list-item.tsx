import { ComponentProps } from "react";

import { DeliveryMethod } from "@prisma/client";
import { CircleAlertIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { FirewoodDetails } from "@/components/quotation-request/firewood-details";
import { ShortDeliveryDetails } from "@/components/quotation-request/short-delivery-details";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { RelativeTime } from "@/components/ui/relative-time";
import { OfferDTO } from "@/db/offer";
import { currencyConfigs } from "@/i18n/currencies";
import { Link, Pathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface OfferListItemProps extends ComponentProps<"li"> {
   offer: OfferDTO;
   useTrackOfferVisibility: (offerId: string) => (node?: Element | null) => void;
}

export const OfferListItem = ({
   offer,
   useTrackOfferVisibility,
   ...props
}: Readonly<OfferListItemProps>) => {
   const t = useTranslations();

   const visibilityRef = useTrackOfferVisibility(offer.id);

   const quotationRequest = offer.quotationRequest;

   const format = useFormatter();
   const earliestAvailability = format.dateTime(offer.earliestAvailability, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
   });

   const buyerHasSeen = offer.buyerLastSeenAt && offer.buyerLastSeenAt >= offer.updatedAt;

   const isRejected = offer.rejectedAt && offer.rejectedAt >= offer.updatedAt;

   const hasHomeDelivery = quotationRequest.deliveryMethods.includes(DeliveryMethod.HOME_DELIVERY);

   const linkPathname: Pathname = "/dashboard/seller/offers/id/[id]";
   return (
      <li {...props} ref={visibilityRef} className={cn("w-full", props.className)}>
         <Card
            className={cn(
               "flex flex-col justify-between gap-4 p-4 xs:flex-row",
               isRejected && "border-destructive/50 bg-destructive/5"
            )}
         >
            <div className="text-sm">
               <Link href={{ pathname: linkPathname, params: { id: offer.id } }}>
                  <CardTitle className="mb-2 text-xl font-bold hover:underline">
                     {offer.price} {currencyConfigs[offer.currency].symbol}
                  </CardTitle>
               </Link>

               <FirewoodDetails quotationRequest={quotationRequest} />

               <ShortDeliveryDetails
                  deliveryMethods={offer.deliveryMethods}
                  pickupCity={offer.pickupCity}
                  deliveryCity={quotationRequest.city}
               />

               <p className="text-sm">
                  {hasHomeDelivery
                     ? t("offer.Earliest delivery date")
                     : t("offer.Earliest pickup date")}{" "}
                  {earliestAvailability}
               </p>

               <p className="mt-2 text-xs text-muted-foreground">
                  {t("quotation-request.Last updated")} <RelativeTime date={offer.updatedAt} />
               </p>
            </div>
            <div className="relative flex flex-col justify-center">
               <div className="absolute -top-2 right-0 flex items-center gap-2 text-xs">
                  {!buyerHasSeen && !isRejected && <p>{t("offer.Not seen")}</p>}
                  {buyerHasSeen && !isRejected && <p>{t("offer.Seen")}</p>}
                  {isRejected && <p className="text-destructive">{t("offer.Rejected")}</p>}
                  {isRejected && offer.isActive && (
                     <CircleAlertIcon className="stroke-destructive" />
                  )}
               </div>
               <Button
                  asChild
                  variant="outline"
                  className={cn(
                     isRejected &&
                        offer.isActive &&
                        "border-destructive/50 text-destructive hover:text-destructive/90"
                  )}
               >
                  <Link href={{ pathname: linkPathname, params: { id: offer.id } }}>
                     {t("actions.View")}
                  </Link>
               </Button>
            </div>
         </Card>
      </li>
   );
};
