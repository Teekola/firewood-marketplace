"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import {
   CountryField,
   DEFAULT_COUNTRY,
   countries,
} from "@/app/[locale]/request-offers/(stepper)/delivery/country-field";
import { PostalCodeField } from "@/app/[locale]/request-offers/(stepper)/delivery/postal-code-field";
import { useGeolocationData } from "@/components/auth/user-store-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SellerLocation } from "../../../../../../prisma/prismaClientExtensions";
import { getSellerLocation, upsertSellerLocation } from "./actions";

export const sellerLocationFormSchema = z.object({
   countryCode: z.enum(["FI", "US"]),
   countryName: z.string(),
   postalCode: z.string().min(5, { message: "Invalid postal code" }),
   city: z.string(),
   latitude: z.number(),
   longitude: z.number(),
});

export type SellerLocationFormData = z.infer<typeof sellerLocationFormSchema>;
export const sellerLocationQueryKey = "seller-location";

export function SellerLocationForm() {
   const queryClient = useQueryClient();
   const geolocationData = useGeolocationData();
   const t = useTranslations("dashboard");

   const {
      data: sellerLocation,
      isLoading,
      error,
   } = useQuery({
      queryKey: [sellerLocationQueryKey],
      queryFn: getSellerLocation,
   });

   const countryCode = sellerLocation?.countryCode ?? geolocationData.country;
   const validCountryCode = countries.find((country) => country.code === countryCode);

   const defaultValues: DefaultValues<SellerLocationFormData> = {
      countryCode: validCountryCode ? validCountryCode.code : DEFAULT_COUNTRY.code,
      countryName: validCountryCode ? validCountryCode.label : DEFAULT_COUNTRY.label,
      postalCode: sellerLocation?.postalCode ?? "",
      city: sellerLocation?.city ?? "",
      latitude: sellerLocation?.coordinates.latitude,
      longitude: sellerLocation?.coordinates.longitude,
   };

   const form = useForm<SellerLocationFormData>({
      resolver: zodResolver(sellerLocationFormSchema),
      defaultValues,
   });

   const canProceed = form.formState.isValid && form.formState.isDirty;

   const { mutateAsync: saveSellerLocation } = useMutation({
      mutationFn: upsertSellerLocation,
      onMutate: async (newData) => {
         // Cancel outgoing fetches for the query to avoid overwriting the optimistic update
         await queryClient.cancelQueries({ queryKey: [sellerLocationQueryKey] });

         // Snapshot the previous value
         const previousData = queryClient.getQueryData([sellerLocationQueryKey]);

         // Optimistically update the cache
         queryClient.setQueryData<Partial<SellerLocation> | undefined>(
            [sellerLocationQueryKey],
            (old) => {
               if (!old) return newData;

               return {
                  ...old,
                  ...newData,
               };
            }
         );

         // Return a context with the previous value
         return { previousData };
      },
      // Rollback if mutation fails
      onError: (err, newData, context) => {
         queryClient.setQueryData([sellerLocationQueryKey], context?.previousData);
      },
      // Refetch to ensure the cache is in sync with the server
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: [sellerLocationQueryKey] });
      },
   });

   async function onSubmit(data: SellerLocationFormData) {
      await saveSellerLocation(data);
      form.reset(data);
   }

   // Ensures that the form is reset correctly
   useEffect(() => {
      if (sellerLocation && !isLoading) {
         const validCountryCode = countries.find((country) => country.code === countryCode);
         form.reset({
            countryCode: validCountryCode?.code ?? DEFAULT_COUNTRY.code,
            countryName: validCountryCode?.label ?? DEFAULT_COUNTRY.label,
            postalCode: sellerLocation.postalCode,
            city: sellerLocation.city,
            latitude: sellerLocation.coordinates.latitude,
            longitude: sellerLocation.coordinates.longitude,
         });
      }
   }, [isLoading, sellerLocation, form.reset, form, countryCode]);

   if (error) {
      return <p>{error.message}</p>;
   }
   if (isLoading) {
      return null;
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-full max-w-lg flex-1 flex-col justify-between gap-4"
         >
            <div className="space-y-4">
               <CountryField />
               <PostalCodeField />
            </div>

            <div>
               <Button type="submit" size="lg" data-disabled={!canProceed}>
                  {t("actions.Save")}
               </Button>
            </div>
         </form>
      </Form>
   );
}
