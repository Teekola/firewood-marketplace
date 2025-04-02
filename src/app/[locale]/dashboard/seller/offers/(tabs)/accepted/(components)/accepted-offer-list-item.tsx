import { ComponentProps } from "react";

import { DeliveryMethod } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { PreviewSection } from "@/components/preview-section";
import { DeliveryDetails } from "@/components/quotation-request/delivery-details";
import { FirewoodDetails } from "@/components/quotation-request/firewood-details";
import { RelativeTime } from "@/components/relative-time";
import { Card, CardTitle } from "@/components/ui/card";
import { currencyConfigs } from "@/i18n/currencies";
import { cn } from "@/lib/utils";

interface AcceptedOfferListItemProps extends ComponentProps<"li"> {
   offer: OfferDTO;
   useTrackOfferVisibility: (offerId: string) => (node?: Element | null) => void;
}

export const AcceptedOfferListItem = ({
   offer,
   useTrackOfferVisibility,
   ...props
}: Readonly<AcceptedOfferListItemProps>) => {
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

   const hasHomeDelivery = quotationRequest.deliveryMethods.includes(DeliveryMethod.HOME_DELIVERY);

   // TODO: Make this contain all required and appropriate information formatted in a nice way!
   // TODO: Add possibility to cancel accepted offer!

   return (
      <li {...props} ref={visibilityRef} className={cn("w-full", props.className)}>
         <Card className={cn("flex flex-col justify-between gap-4 p-4 xs:flex-row")}>
            <div className="flex flex-col gap-2 text-sm">
               <CardTitle className="mb-2 text-xl font-bold hover:underline">
                  {offer.price} {currencyConfigs[offer.currency].symbol}
               </CardTitle>

               <PreviewSection title={t("request-offers.Contact")}>
                  <p>{offer.quotationRequest.buyerName}</p>
                  <p>{offer.quotationRequest.buyerEmail}</p>
                  <p>{offer.quotationRequest.buyerPhone}</p>
                  {offer.quotationRequest.buyerCompanyName && (
                     <p>{offer.quotationRequest.buyerCompanyName}</p>
                  )}
               </PreviewSection>

               <PreviewSection title={t("request-offers.Firewood")}>
                  <FirewoodDetails quotationRequest={quotationRequest} />
               </PreviewSection>

               <PreviewSection title={t("request-offers.Delivery")}>
                  <DeliveryDetails
                     deliveryMethods={offer.deliveryMethods}
                     quotationRequest={offer.quotationRequest}
                     pickupAddress={offer.pickupAddress}
                     pickupCity={offer.pickupCity}
                     pickupCountryName={offer.pickupCountryName}
                     pickupPostalCode={offer.pickupPostalCode}
                     displayPickupAddress
                  />
                  <p className="text-sm">
                     {hasHomeDelivery
                        ? t("offer.Earliest delivery date")
                        : t("offer.Earliest pickup date")}{" "}
                     {earliestAvailability}
                  </p>
               </PreviewSection>

               {offer.quotationRequest.additionalInformation && (
                  <PreviewSection title={t("request-offers.Additional information")}>
                     <p className="text-sm">{offer.quotationRequest.additionalInformation}</p>
                  </PreviewSection>
               )}

               {/**TODO: ADD BUYER INFORMATION */}

               <p className="mt-2 text-xs text-muted-foreground">
                  {t("offer.Accepted at")} <RelativeTime date={offer.acceptedAt!} />
               </p>
            </div>
         </Card>
      </li>
   );
};
