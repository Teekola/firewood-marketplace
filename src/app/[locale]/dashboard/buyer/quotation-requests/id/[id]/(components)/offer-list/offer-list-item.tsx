import { ComponentProps, forwardRef } from "react";

import { DeliveryMethod } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";

import { SidebarNavIndicator } from "@/app/[locale]/dashboard/(components)/sidebar-nav-indicator";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useGetTranslatedCountryName } from "@/components/ui/country-field";
import { RelativeTime } from "@/components/ui/relative-time";
import { OfferDTO } from "@/db/offer";
import { currencyConfigs } from "@/i18n/currencies";
import { Link, Pathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface OfferListItemProps extends ComponentProps<"li"> {
   offer: OfferDTO;
}

export const OfferListItem = forwardRef<HTMLLIElement, Readonly<OfferListItemProps>>(
   ({ offer, ...props }, ref) => {
      const t = useTranslations();
      const getTranslatedCountryName = useGetTranslatedCountryName();

      const format = useFormatter();
      const earliestAvailability = format.dateTime(offer.earliestAvailability, {
         year: "numeric",
         month: "numeric",
         day: "numeric",
         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      const hasHomeDelivery = offer.deliveryMethods.includes(DeliveryMethod.HOME_DELIVERY);
      const hasPickup = offer.deliveryMethods.includes(DeliveryMethod.PICKUP);
      const linkPathname: Pathname = "/dashboard/buyer/quotation-requests/id/[id]/id/[offerId]";
      return (
         <li {...props} ref={ref} className={cn("w-full", props.className)}>
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

                  <p className="text-sm capitalize">
                     {hasHomeDelivery &&
                        t("delivery-methods.HOME_DELIVERY") + (hasPickup ? ", " : "")}

                     {hasPickup &&
                        `${t("delivery-methods.PICKUP")} ${offer.pickupPostalCode} ${offer.pickupCity}, ${getTranslatedCountryName(offer.pickupCountryName)}`}
                  </p>
                  <p className="text-sm">
                     {hasHomeDelivery
                        ? t("offer.Earliest delivery date")
                        : t("offer.Earliest pickup date")}{" "}
                     {earliestAvailability}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
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
                        {t("actions.View")}{" "}
                        {(!offer.buyerLastSeenAt || offer.buyerLastSeenAt < offer.updatedAt) && (
                           <SidebarNavIndicator
                              number={1}
                              className="static ml-2 h-3 w-3 text-destructive"
                           />
                        )}
                     </Link>
                  </Button>
               </div>
            </Card>
         </li>
      );
   }
);

OfferListItem.displayName = "OfferListItem";
