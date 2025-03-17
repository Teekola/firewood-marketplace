import { ComponentProps, forwardRef } from "react";

import { DeliveryMethod, WoodDryness } from "@prisma/client";
import { CircleAlertIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { RelativeTime } from "@/components/relative-time";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useGetTranslatedCountryName } from "@/components/ui/country-field";
import { currencyConfigs } from "@/i18n/currencies";
import { Link, Pathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { useQuotationRequestData } from "../../../../../../components/quotation-request/use-quotation-request-data";

interface OfferListItemProps extends ComponentProps<"li"> {
   offer: OfferDTO;
}

export const OfferListItem = forwardRef<HTMLLIElement, Readonly<OfferListItemProps>>(
   ({ offer, ...props }, ref) => {
      const t = useTranslations();
      const getTranslatedCountryName = useGetTranslatedCountryName();
      const quotationRequest = offer.quotationRequest;
      const { amount, amountUnit, lengthUnit, maxLength } =
         useQuotationRequestData(quotationRequest);

      console.log(offer.pickupCountryName);

      const format = useFormatter();
      const earliestAvailability = format.dateTime(offer.earliestAvailability, {
         year: "numeric",
         month: "numeric",
         day: "numeric",
         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      const buyerHasSeen = offer.buyerLastSeenAt && offer.buyerLastSeenAt >= offer.updatedAt;
      const isRejected = offer.rejectedAt && offer.rejectedAt >= offer.updatedAt;

      const isHomeDelivery = quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY;
      const linkPathname: Pathname = "/dashboard/seller/offers/id/[id]";
      return (
         <li {...props} ref={ref} className={cn("w-full", props.className)}>
            <Card
               className={cn(
                  "flex flex-col justify-between gap-4 p-4 xs:flex-row",
                  isRejected && "border-destructive/50 bg-destructive/5"
               )}
            >
               <div>
                  <Link href={{ pathname: linkPathname, params: { id: offer.id } }}>
                     <CardTitle className="mb-2 text-xl font-bold hover:underline">
                        {offer.price} {currencyConfigs[offer.currency].symbol}
                     </CardTitle>
                  </Link>
                  <p className="text-sm">
                     <span className="relative">
                        {amount} {amountUnit}
                        <sup className="text-xs">{"3"}</sup>
                     </span>{" "}
                     {quotationRequest.woodDryness === WoodDryness.ANY
                        ? t("request-offers.dry or green")
                        : t(`request-offers.${quotationRequest.woodDryness.toLowerCase()}`)}{" "}
                     {t(`request-offers.${quotationRequest.woodType.toLowerCase()}`)}
                     {maxLength && `, ${maxLength} ${lengthUnit}`}
                  </p>

                  <p className="text-sm capitalize">
                     {isHomeDelivery
                        ? `${t("request-offers.home delivery")} ${quotationRequest.city}, ${getTranslatedCountryName(quotationRequest.countryName)}`
                        : `${t("request-offers.pickup")} ${offer.pickupCity}, ${getTranslatedCountryName(offer.pickupCountryName)}`}
                  </p>
                  <p className="text-sm">
                     {isHomeDelivery
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
                     {isRejected && <CircleAlertIcon className="stroke-destructive" />}
                  </div>
                  <Button
                     asChild
                     variant="outline"
                     className={cn(
                        isRejected &&
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
   }
);

OfferListItem.displayName = "OfferListItem";
