import { DeliveryMethod } from "@prisma/client";
import { useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";

import { Date } from "../date";

export function DeliveryDetails({
   quotationRequest: qr,
   earliestAvailability,
   displayPickupAddress,
}: Readonly<{
   quotationRequest: QuotationRequest;
   earliestAvailability?: Date;
   displayPickupAddress?: boolean;
}>) {
   const t = useTranslations();

   const isHomeDelivery = qr.deliveryMethod === DeliveryMethod.HOME_DELIVERY;
   const shouldDisplayAddress = isHomeDelivery || (!isHomeDelivery && displayPickupAddress);

   // TODO: STORE SELLER'S ADDRESS IN THE QUOTATION REQUEST WHEN CREATING IF DELIVERY METHOD IS PICKUP
   // TODO: MIGHT NEED TO STORE THEM IN THE QR INTO THEIR OWN FIELDS (pickupPostalCode, pickupCountry, pickupCity, pickupAddress)
   // TODO: NEED TO ALSO DISPLAY THE SELLER'S POSTALCODE AND CITY WHEN PICKUP!
   // TODO: ENSURE THAT THE ADDRESS IS DISPLAYED CORRECTLY AFTER THE CHANGE IN ALL PLACES!
   return (
      <>
         <p className="capitalize">{t(`request-offers.${qr.deliveryMethod}`)}</p>
         {shouldDisplayAddress && <p>{qr.address}</p>}
         {isHomeDelivery && (
            <p>
               {qr.postalCode} <span className="capitalize">{qr.city?.toLowerCase()}</span>
               {", "}
               {t(`countries.${qr.countryName}`)}
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
