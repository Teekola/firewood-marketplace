import { DeliveryMethod } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";

import { Date } from "../date";
import { useGetTranslatedCountryName } from "../ui/country-field";

export function DeliveryDetails({
   quotationRequest: qr,
   deliveryMethods,
   earliestAvailability,
   displayPickupAddress,
   pickupCountryName,
   pickupCity,
   pickupPostalCode,
   pickupAddress,
}: Readonly<{
   quotationRequest: QuotationRequest;
   deliveryMethods: DeliveryMethod[];
   earliestAvailability?: Date;
   displayPickupAddress?: boolean;
   pickupCountryName?: string | null;
   pickupCity?: string | null;
   pickupPostalCode?: string | null;
   pickupAddress?: string | null;
}>) {
   const t = useTranslations();
   const getTranslatedCountryName = useGetTranslatedCountryName();

   const hasHomeDelivery = deliveryMethods.includes(DeliveryMethod.HOME_DELIVERY);
   const hasPickup = deliveryMethods.includes(DeliveryMethod.PICKUP);

   return (
      <>
         {hasPickup && (
            <div>
               <p>{t("delivery-methods.PICKUP")}</p>

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
            </div>
         )}
         {hasPickup && hasHomeDelivery && <p>{t("conjunctions.or")}</p>}
         {hasHomeDelivery && (
            <div>
               <p>{t("delivery-methods.HOME_DELIVERY")}</p>
               <p>
                  {qr.address} {qr.postalCode}{" "}
                  <span className="capitalize">{qr.city?.toLowerCase()}</span>
                  {", "}
                  {getTranslatedCountryName(qr.countryName)}
               </p>
            </div>
         )}

         {earliestAvailability && (
            <p>
               {hasHomeDelivery
                  ? t("offer.Earliest delivery date")
                  : t("offer.Earliest pickup date")}{" "}
               <Date date={earliestAvailability} />
            </p>
         )}
      </>
   );
}
