import { DeliveryMethod } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";

import { Date } from "../date";
import { useGetTranslatedCountryName } from "../ui/country-field";

export function DeliveryDetails({
   quotationRequest: qr,
   earliestAvailability,
   displayPickupAddress,
   pickupCountryName,
   pickupCity,
   pickupPostalCode,
   pickupAddress,
}: Readonly<{
   quotationRequest: QuotationRequest;
   earliestAvailability?: Date;
   displayPickupAddress?: boolean;
   pickupCountryName?: string | null;
   pickupCity?: string | null;
   pickupPostalCode?: string | null;
   pickupAddress?: string | null;
}>) {
   const t = useTranslations();
   const getTranslatedCountryName = useGetTranslatedCountryName();

   const isHomeDelivery = qr.deliveryMethod === DeliveryMethod.HOME_DELIVERY;

   return (
      <>
         <p className="capitalize">{t(`request-offers.${qr.deliveryMethod}`)}</p>
         {isHomeDelivery ? (
            <p>
               {qr.postalCode} <span className="capitalize">{qr.city?.toLowerCase()}</span>
               {", "}
               {getTranslatedCountryName(qr.countryName)}
            </p>
         ) : (
            <p>
               {displayPickupAddress && (
                  <span>
                     {pickupAddress}
                     {", "}
                  </span>
               )}
               {pickupPostalCode && pickupCity && pickupCountryName && (
                  <span>
                     {pickupPostalCode} {pickupCity}
                     {", "}
                     {getTranslatedCountryName(pickupCountryName)}{" "}
                  </span>
               )}
            </p>
         )}

         {earliestAvailability && (
            <p>
               {isHomeDelivery
                  ? t("offer.Earliest delivery date")
                  : t("offer.Earliest pickup date")}{" "}
               <Date date={earliestAvailability} />
            </p>
         )}
      </>
   );
}
