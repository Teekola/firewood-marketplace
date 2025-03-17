import { ComponentProps, forwardRef } from "react";

import { DeliveryMethod } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { RelativeTime } from "@/components/relative-time";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useGetTranslatedCountryName } from "@/components/ui/country-field";
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

      const isHomeDelivery = offer.quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY;
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
                     {isHomeDelivery
                        ? t("request-offers.home_delivery")
                        : `${t("request-offers.pickup")} ${offer.pickupPostalCode} ${offer.pickupCity}, ${getTranslatedCountryName(offer.pickupCountryName)}`}
                  </p>
                  <p className="text-sm">
                     {isHomeDelivery
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
                        {t("actions.View")}
                     </Link>
                  </Button>
               </div>
            </Card>
         </li>
      );
   }
);

OfferListItem.displayName = "OfferListItem";
