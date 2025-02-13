"use client";

import { DeliveryMethod, UnitSystem, WoodDryness } from "@prisma/client";
import { useFormatter, useTranslations } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { useUser } from "@/components/auth/user-store-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { centimetersToInches, cubicMetersToCubicFeet } from "@/lib/utils/unit-conversions";
import {
   imperialWoodAmountUnit,
   imperialWoodLengthUnit,
   metricWoodAmountUnit,
   metricWoodLengthUnit,
} from "@/lib/utils/units";

export function QuotationRequestListItem({
   quotationRequest,
}: Readonly<{
   quotationRequest: QuotationRequest;
}>) {
   const t = useTranslations();
   const format = useFormatter();

   const isImperial = useUser().preferredUnitSystem === UnitSystem.IMPERIAL;
   const amountUnit = isImperial ? imperialWoodAmountUnit : metricWoodAmountUnit;
   const lengthUnit = isImperial ? imperialWoodLengthUnit : metricWoodLengthUnit;
   const amount = isImperial
      ? cubicMetersToCubicFeet(quotationRequest.woodAmountCubicMeters)
      : quotationRequest.woodAmountCubicMeters;
   const maxLength = quotationRequest.woodMaxLengthCm
      ? isImperial
         ? centimetersToInches(quotationRequest.woodMaxLengthCm)
         : quotationRequest.woodMaxLengthCm
      : null;

   const updatedAt = format.dateTime(quotationRequest.updatedAt, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
   });
   const href = "/dashboard/seller/quotation-requests";
   return (
      <li>
         <Card className="flex flex-col justify-between gap-4 p-4 xs:flex-row">
            <div className="flex flex-col gap-2">
               <Link href={href} className="hover:underline">
                  <CardTitle className="font-bold">
                     <span className="relative pr-3">
                        {amount} {amountUnit}
                        <span className="absolute -translate-y-1/4 text-xs">{"3"}</span>
                     </span>
                     {quotationRequest.woodDryness === WoodDryness.ANY
                        ? t("request-offers.dry or green")
                        : t(`request-offers.${quotationRequest.woodDryness.toLowerCase()}`)}{" "}
                     {t(`request-offers.${quotationRequest.woodType.toLowerCase()}`)}
                     {maxLength && `, ${maxLength} ${lengthUnit}`}
                  </CardTitle>
               </Link>

               <p className="text-sm capitalize">
                  {t(`request-offers.${quotationRequest.deliveryMethod.toLowerCase()}`)}

                  {quotationRequest.deliveryMethod === DeliveryMethod.HOME_DELIVERY &&
                     `, ${quotationRequest.city}`}
               </p>

               <p className="text-sm text-muted-foreground">{updatedAt}</p>
            </div>
            <Button asChild variant="outline" className="my-auto">
               <Link href={href}>{"View"}</Link>
            </Button>
         </Card>
      </li>
   );
}
