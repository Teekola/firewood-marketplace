"use client";

import { UnitSystem } from "@prisma/client";
import { useFormatter } from "next-intl";

import { QuotationRequest } from "@/app/db/quotation-request";
import { useUser } from "@/components/auth/user-store-provider";
import {
   imperialWoodAmountUnit,
   imperialWoodLengthUnit,
   metricWoodAmountUnit,
   metricWoodLengthUnit,
} from "@/i18n/units";
import { centimetersToInches, cubicMetersToCubicFeet } from "@/lib/utils/unit-conversions";

export function useQuotationRequestData(quotationRequest: QuotationRequest) {
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

   return { amountUnit, lengthUnit, amount, maxLength, updatedAt };
}
