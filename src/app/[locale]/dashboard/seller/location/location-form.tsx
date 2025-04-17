"use client";

import { ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { CountryField } from "@/components/ui/country-field";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormRootError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PostalCodeField } from "@/components/ui/postal-code-field";
import { SellerLocation } from "@/db/seller-location";
import { useGeolocationData } from "@/hooks/use-geolocation-data";
import { useUser } from "@/hooks/user-store";
import { DEFAULT_COUNTRY, countries } from "@/i18n/constants/countries";
import "@/i18n/utils/unit-conversions";
import { kilometersToMiles, milesToKilometers } from "@/i18n/utils/unit-conversions";
import { parseError } from "@/lib/utils/errors";

import { upsertSellerLocation } from "./actions";
import { sellerLocationQueryKey } from "./constants";
import { MaxDistanceSelectField } from "./max-distance-select-field";

export const sellerLocationFormSchema = z.object({
   countryCode: z.enum(["FI", "US"]),
   countryName: z.string(),
   postalCode: z.string().min(5, { message: "Invalid postal code" }),
   city: z.string(),
   address: z.string(),
   latitude: z.number(),
   longitude: z.number(),
   maxDistance: z.string(),
});

export type SellerLocationFormData = z.infer<typeof sellerLocationFormSchema>;

interface SellerLocationFormProps extends ComponentProps<"form"> {
   sellerLocation?: SellerLocation | null;
   isLoading?: boolean;
}

const DEFAULT_MAX_DISTANCE = 50;

export function SellerLocationForm({
   sellerLocation,
   isLoading,
   ...props
}: SellerLocationFormProps) {
   const geolocationData = useGeolocationData();
   const t = useTranslations();
   const queryClient = useQueryClient();

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
   const defaultValues: DefaultValues<SellerLocationFormData> = isLoading
      ? {}
      : {
           countryCode: validCountryCode ? validCountryCode.code : DEFAULT_COUNTRY.code,
           countryName: validCountryCode ? validCountryCode.label : DEFAULT_COUNTRY.label,
           postalCode: sellerLocation?.postalCode ?? "",
           city: sellerLocation?.city ?? "",
           address: sellerLocation?.address ?? "",
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
         queryClient.invalidateQueries({ queryKey: sellerLocationQueryKey });
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
            <CountryField
               name="countryCode"
               countryNameField="countryName"
               disabled={isLoading}
               onCountrySelect={() => {
                  form.setValue("postalCode", "", { shouldDirty: true });
                  form.setValue("city", "", { shouldDirty: true });
               }}
            />
            <PostalCodeField
               name="postalCode"
               label={t("form-labels.Postal code")}
               cityField="city"
               countryField="countryCode"
               disabled={isLoading}
               onPostalCodeSelect={({ latitude, longitude }) => {
                  form.setValue("latitude", latitude, { shouldDirty: true });
                  form.setValue("longitude", longitude, {
                     shouldDirty: true,
                     shouldValidate: true,
                  });
               }}
            />
            <FormField
               control={form.control}
               disabled={isLoading}
               name="address"
               render={({ field }) => (
                  <FormItem className="w-full">
                     <FormLabel>
                        {t("form-labels.Pickup address")} {t("form-labels.Optional")}
                     </FormLabel>
                     <FormControl>
                        <Input {...field} />
                     </FormControl>
                     <FormDescription>
                        {t("seller-location.pickup-address-description")}
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <MaxDistanceSelectField<SellerLocationFormData>
               name="maxDistance"
               disabled={isLoading}
            />

            <Button
               type="submit"
               size="lg"
               data-disabled={!canProceed}
               disabled={isLoading}
               className="mt-4 sm:w-fit"
            >
               {t("actions.Save")}
            </Button>
            <FormRootError />
         </form>
      </Form>
   );
}
