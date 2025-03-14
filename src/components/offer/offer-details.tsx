"use client";

import { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { currencyConfigs } from "@/i18n/currencies";

import { PreviewSection } from "../preview-section";
import { DeliveryDetails } from "../quotation-request/delivery-details";
import { SellerDetails } from "./seller-details";

interface OfferDetailsProps extends ComponentProps<"section"> {
   offer: OfferDTO;
   isAccepted?: boolean;
}

export function OfferDetails({ offer, isAccepted, ...props }: OfferDetailsProps) {
   const t = useTranslations();

   const currency = currencyConfigs[offer.currency];

   return (
      <section {...props} className="-mt-2 flex flex-col gap-2 text-sm">
         {isAccepted && (
            <PreviewSection title={t("offer.Seller")}>
               <SellerDetails offer={offer} />
            </PreviewSection>
         )}
         <PreviewSection title={t("offer.Price")}>
            <p>
               {currency.symbolPosition === "before" && currency.symbol}
               {offer.price} {currency.symbolPosition === "after" && currency.symbol}
            </p>
         </PreviewSection>
         <PreviewSection title={t("request-offers.Delivery")}>
            <DeliveryDetails
               quotationRequest={offer.quotationRequest}
               earliestAvailability={offer.earliestAvailability}
               displayPickupAddress={isAccepted}
            />
         </PreviewSection>
      </section>
   );
}
