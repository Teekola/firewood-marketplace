import { ComponentProps, forwardRef } from "react";

import { DeliveryMethod } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { FirewoodDetails } from "@/components/quotation-request/firewood-details";
import { ShortDeliveryDetails } from "@/components/quotation-request/short-delivery-details";
import { RelativeTime } from "@/components/relative-time";
import { Card, CardTitle } from "@/components/ui/card";
import { currencyConfigs } from "@/i18n/currencies";
import { cn } from "@/lib/utils";

interface AcceptedOfferListItemProps extends ComponentProps<"li"> {
   offer: OfferDTO;
}

export const AcceptedOfferListItem = forwardRef<
   HTMLLIElement,
   Readonly<AcceptedOfferListItemProps>
>(({ offer, ...props }, ref) => {
   const t = useTranslations();

   const quotationRequest = offer.quotationRequest;

   const format = useFormatter();
   const earliestAvailability = format.dateTime(offer.earliestAvailability, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
   });

   const hasHomeDelivery = quotationRequest.deliveryMethods.includes(DeliveryMethod.HOME_DELIVERY);

   // TODO: Make this contain all required and appropriate information formatted in a nice way!
   // TODO: Add possibility to cancel accepted offer!

   return (
      <li {...props} ref={ref} className={cn("w-full", props.className)}>
         <Card className={cn("flex flex-col justify-between gap-4 p-4 xs:flex-row")}>
            <div className="text-sm">
               <CardTitle className="mb-2 text-xl font-bold hover:underline">
                  {offer.price} {currencyConfigs[offer.currency].symbol}
               </CardTitle>

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
         </Card>
      </li>
   );
});

AcceptedOfferListItem.displayName = "AcceptedOfferListItem";
