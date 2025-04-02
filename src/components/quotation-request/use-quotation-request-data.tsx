"use client";

import { UnitSystem } from "@prisma/client";

import { useUser } from "@/components/auth/user-store-provider";
import { QuotationRequest } from "@/db/quotation-request";
import {
   imperialWoodAmountUnit,
   imperialWoodLengthUnit,
   metricWoodAmountUnit,
   metricWoodLengthUnit,
} from "@/i18n/units";
import { centimetersToInches, cubicMetersToCubicFeet } from "@/lib/utils/unit-conversions";

export function useQuotationRequestData(quotationRequest: QuotationRequest) {
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

   return { amountUnit, lengthUnit, amount, maxLength, updatedAt: quotationRequest.updatedAt };
}
