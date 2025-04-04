"use client";

import { UnitSystem } from "@prisma/client";

import { QuotationRequest } from "@/db/quotation-request";
import { useUser } from "@/hooks/user-store";
import {
   imperialWoodAmountUnit,
   imperialWoodLengthUnit,
   metricWoodAmountUnit,
   metricWoodLengthUnit,
} from "@/i18n/constants/units";
import { centimetersToInches, cubicMetersToCubicFeet } from "@/i18n/utils/unit-conversions";

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
