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
import { useGeolocationData } from "@/components/auth/user-store-provider";
import { Button } from "@/components/ui/button";
import { Form, FormRootError } from "@/components/ui/form";
import { parseError } from "@/lib/utils/errors";

import { SellerLocation } from "../../../../../../prisma/prismaClientExtensions";
import { upsertSellerLocation } from "./actions";

export const sellerLocationFormSchema = z.object({
   countryCode: z.enum(["FI", "US"]),
   countryName: z.string(),
   postalCode: z.string().min(5, { message: "Invalid postal code" }),
   city: z.string(),
   latitude: z.number(),
   longitude: z.number(),
});

export type SellerLocationFormData = z.infer<typeof sellerLocationFormSchema>;

interface SellerLocationFormProps extends ComponentProps<"form"> {
   sellerLocation: SellerLocation | null;
}

export function SellerLocationForm({ sellerLocation, ...props }: SellerLocationFormProps) {
   const geolocationData = useGeolocationData();
   const t = useTranslations("dashboard");

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

   async function onSubmit(data: SellerLocationFormData) {
      if (!canProceed) return;
      try {
         form.reset(data);
         await upsertSellerLocation(data);
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

            <Button type="submit" size="lg" data-disabled={!canProceed} className="mt-4 sm:w-fit">
               {t("actions.Save")}
            </Button>
            <FormRootError />
         </form>
      </Form>
   );
}
