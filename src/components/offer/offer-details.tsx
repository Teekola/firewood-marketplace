"use client";

import { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { OfferDTO } from "@/app/db/offer";
import { currencyConfigs } from "@/i18n/currencies";

import { PreviewSection } from "../preview-section";
import { DeliveryDetails } from "../quotation-request/delivery-details";
import { FirewoodDetails } from "../quotation-request/firewood-details";
import { SellerDetails } from "./seller-details";

interface OfferDetailsProps extends ComponentProps<"section"> {
   offer: OfferDTO;
   showSellerDetails?: boolean;
   showAddress?: boolean;
}

export function OfferDetails({
   offer,
   showSellerDetails,
   showAddress,
   ...props
}: OfferDetailsProps) {
   const t = useTranslations();

   const currency = currencyConfigs[offer.currency];

   return (
      <section {...props} className="-mt-2 flex flex-col gap-2 text-sm">
         {showSellerDetails && (
            <PreviewSection title={t("offer.Seller")}>
               <SellerDetails offer={offer} />
            </PreviewSection>
         )}
         <PreviewSection title={t("request-offers.Firewood")}>
            <FirewoodDetails quotationRequest={offer.quotationRequest} />
         </PreviewSection>
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
               displayPickupAddress={showAddress}
               pickupAddress={offer.pickupAddress}
               pickupCity={offer.pickupCity}
               pickupPostalCode={offer.pickupPostalCode}
               pickupCountryName={offer.pickupCountryName}
            />
         </PreviewSection>
      </section>
   );
}
