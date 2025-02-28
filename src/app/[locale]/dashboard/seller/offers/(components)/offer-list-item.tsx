import { ComponentProps, forwardRef } from "react";

import { DeliveryMethod, WoodDryness } from "@prisma/client";
import { CircleAlertIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { currencyConfigs } from "@/i18n/currencies";
import { cn } from "@/lib/utils";

import { useQuotationRequestData } from "../../quotation-requests/(hooks)/use-quotation-request-data";

interface OfferListItemProps extends ComponentProps<"li"> {
   offer: OfferDTO;
}

export const OfferListItem = forwardRef<HTMLLIElement, Readonly<OfferListItemProps>>(
   ({ offer, ...props }, ref) => {
      const t = useTranslations();
      const quotationRequest = offer.quotationRequest;
      const { amount, amountUnit, lengthUnit, maxLength } =
         useQuotationRequestData(quotationRequest);

      const format = useFormatter();
      const earliestAvailability = format.dateTime(offer.earliestAvailability, {
         year: "numeric",
         month: "numeric",
         day: "numeric",
         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      const updatedAt = format.dateTime(offer.updatedAt, {
         year: "numeric",
         month: "numeric",
         day: "numeric",
         timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      const isHomeDelivery = quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY;
      return (
         <li {...props} ref={ref} className={cn("w-full", props.className)}>
            <Card
               className={cn(
                  "flex flex-col justify-between gap-4 p-4 xs:flex-row",
                  offer.rejectedAt && "border-destructive/50 bg-destructive/5"
               )}
            >
               <div>
                  <CardTitle className="mb-2 text-xl font-bold">
                     {offer.price} {currencyConfigs[offer.currency].symbol}
                  </CardTitle>
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
                  {isHomeDelivery && (
                     <p className="text-sm">
                        {t("offer.Earliest delivery date")} {earliestAvailability}
                     </p>
                  )}
                  {!isHomeDelivery && (
                     <p className="text-sm">
                        {t("offer.Earliest pickup date")} {earliestAvailability}
                     </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                     {t("quotation-request.Last updated")} {updatedAt}
                  </p>
               </div>
               <div className="relative flex flex-col justify-center">
                  <div className="absolute -top-2 right-0 flex items-center gap-2 text-xs">
                     {/** TODO: Display if the offer was seen or not */}
                     {!offer.rejectedAt && <p>{t("offer.Not seen")}</p>}
                     {offer.acceptedAt && <p>{t("offer.Seen")}</p>}
                     {offer.rejectedAt && <p className="text-destructive">{t("offer.Rejected")}</p>}
                     {offer.rejectedAt && <CircleAlertIcon className="stroke-destructive" />}
                  </div>
                  <Button
                     variant="outline"
                     className={cn(
                        offer.rejectedAt &&
                           "border-destructive/50 text-destructive hover:text-destructive/90"
                     )}
                  >
                     {t("actions.View")}
                  </Button>
               </div>
            </Card>
         </li>
      );
   }
);

OfferListItem.displayName = "OfferListItem";
