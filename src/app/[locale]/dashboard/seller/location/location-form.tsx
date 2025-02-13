"use client";

import { ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import {
   CountryField,
   DEFAULT_COUNTRY,
   countries,
} from "@/app/[locale]/request-offers/(stepper)/delivery/country-field";
import { PostalCodeField } from "@/app/[locale]/request-offers/(stepper)/delivery/postal-code-field";
import { useGeolocationData, useUser } from "@/components/auth/user-store-provider";
import { Button } from "@/components/ui/button";
import { Form, FormRootError } from "@/components/ui/form";
import { parseError } from "@/lib/utils/errors";
import "@/lib/utils/unit-conversions";
import { kilometersToMiles, milesToKilometers } from "@/lib/utils/unit-conversions";

import { SellerLocation } from "../../../../../../prisma/prismaClientExtensions";
import { upsertSellerLocation } from "./actions";
import { MaxDistanceSelectField } from "./maxDistanceSelectField";

export const sellerLocationFormSchema = z.object({
   countryCode: z.enum(["FI", "US"]),
   countryName: z.string(),
   postalCode: z.string().min(5, { message: "Invalid postal code" }),
   city: z.string(),
   latitude: z.number(),
   longitude: z.number(),
   maxDistance: z.string(),
});

export type SellerLocationFormData = z.infer<typeof sellerLocationFormSchema>;

interface SellerLocationFormProps extends ComponentProps<"form"> {
   sellerLocation: SellerLocation | null;
}

const DEFAULT_MAX_DISTANCE = 50;

export function SellerLocationForm({ sellerLocation, ...props }: SellerLocationFormProps) {
   const geolocationData = useGeolocationData();
   const t = useTranslations("dashboard");

   const user = useUser();

   const isMetric = user.preferredUnitSystem === "METRIC";

   // If the user uses imperial system, convert the db value from km to mi
   // otherwise use the default max distance (50 km or 50 mi)
   const maxDistance = sellerLocation?.maxDistanceKm
      ? isMetric
         ? sellerLocation.maxDistanceKm + ""
         : Math.round(kilometersToMiles(sellerLocation.maxDistanceKm)) + ""
      : DEFAULT_MAX_DISTANCE + "";

   const countryCode = sellerLocation?.countryCode ?? geolocationData.country;
   const validCountryCode = countries.find((country) => country.code === countryCode);
   const defaultValues: DefaultValues<SellerLocationFormData> = {
      countryCode: validCountryCode ? validCountryCode.code : DEFAULT_COUNTRY.code,
      countryName: validCountryCode ? validCountryCode.label : DEFAULT_COUNTRY.label,
      postalCode: sellerLocation?.postalCode ?? "",
      city: sellerLocation?.city ?? "",
      latitude: sellerLocation?.coordinates.latitude ?? 0,
      longitude: sellerLocation?.coordinates.longitude ?? 0,
      maxDistance,
   };

   const form = useForm<SellerLocationFormData>({
      resolver: zodResolver(sellerLocationFormSchema),
      defaultValues,
   });

   const canProceed = form.formState.isValid && form.formState.isDirty;

   async function onSubmit(data: SellerLocationFormData) {
      const { maxDistance, ...rest } = data;
      // If the data is in miles, need to convert it to kilometers in the database
      const maxDistanceKm = isMetric ? Number(maxDistance) : milesToKilometers(Number(maxDistance));
      const normalizedData = { ...rest, maxDistanceKm };

      if (!canProceed) return;
      try {
         form.reset(data);
         await upsertSellerLocation(normalizedData);
      } catch (error) {
         const errorData = parseError(error);
         form.reset(defaultValues);
         form.setError("root", { type: "upsertSellerLocationError", message: errorData.message });
      }
   }

   return (
      <Form {...form}>
         <form
            {...props}
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-full max-w-lg flex-1 flex-col gap-4"
         >
            <CountryField />
            <PostalCodeField />
            <MaxDistanceSelectField<SellerLocationFormData> name="maxDistance" />

            <Button type="submit" size="lg" data-disabled={!canProceed} className="mt-4 sm:w-fit">
               {t("actions.Save")}
            </Button>
            <FormRootError />
         </form>
      </Form>
   );
}
