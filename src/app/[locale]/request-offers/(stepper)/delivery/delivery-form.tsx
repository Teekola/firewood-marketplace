"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { SessionWithBuyer } from "@/auth/auth";
import { useGeolocationData } from "@/components/auth/user-store-provider";
import { BackButtonLink } from "@/components/back-button-link";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { StaticPathname, useRouter } from "@/i18n/routing";

import { FormStoreSyncManager } from "../../(components)/form-store-sync-manager";
import { RadioGroupItemCard } from "../../(components)/radio-group-item-card";
import { StickyFooter } from "../../(components)/sticky-footer";
import { stepToPath } from "../../(components)/use-step-manager";
import {
   useDeliveryData,
   useLastUnlockedStep,
   useSetDeliveryData,
} from "../../(store)/request-offers-store-provider";
import { CountryField, DEFAULT_COUNTRY, countries } from "./country-field";
import { PostalCodeField } from "./postal-code-field";

export const deliveryFormSchema = z
   .object({
      deliveryMethod: z.enum(["homeDelivery", "pickup"], {
         required_error: "Please, select a delivery method",
      }),
      countryCode: z.enum(["FI", "US"]),
      countryName: z.string(),
      postalCode: z.string().min(5, { message: "Invalid postal code" }),
      city: z.string(),
      address: z.string().optional(),
      latitude: z.number(),
      longitude: z.number(),
   })
   .refine(
      (data) => {
         if (data.deliveryMethod === "homeDelivery" && !data.address) {
            return false;
         }
         return true;
      },
      {
         message: "Address is required for home delivery",
         path: ["address"],
      }
   );
export type DeliveryData = z.infer<typeof deliveryFormSchema>;

export function DeliveryForm({ session }: Readonly<{ session: SessionWithBuyer }>) {
   const deliveryData = useDeliveryData();
   const lastUnlockedStep = useLastUnlockedStep();
   const geolocationData = useGeolocationData();
   const t = useTranslations("request-offers");
   const router = useRouter();
   const setDeliveryData = useSetDeliveryData();

   // Only use the country code if it is a valid option
   const countryCode = session?.buyer?.countryCode
      ? session.buyer.countryCode
      : geolocationData.country;
   const validCountryCode = countries.find((country) => country.code === countryCode);

   const defaultValues: DefaultValues<DeliveryData> = deliveryData ?? {
      deliveryMethod: "homeDelivery",
      countryCode: validCountryCode ? validCountryCode.code : DEFAULT_COUNTRY.code,
      countryName: validCountryCode ? validCountryCode.label : DEFAULT_COUNTRY.label,
      postalCode: session?.buyer?.postalCode ?? "",
      city: session?.buyer?.city ?? "",
      address: session?.buyer?.address ?? "",
      latitude: session?.buyer?.latitude ?? undefined,
      longitude: session?.buyer?.longitude ?? undefined,
   };

   const form = useForm<DeliveryData>({
      resolver: zodResolver(deliveryFormSchema),
      defaultValues,
   });

   const deliveryMethod = form.watch("deliveryMethod");

   const canProceed = form.formState.isValid;

   // This updates the values in the form if the user signs in and has buyer data
   useEffect(() => {
      if (!session) return;
      const { buyer } = session;
      if (!buyer) return;

      if (buyer.countryCode) {
         const found = countries.find((country) => country.code === buyer.countryCode);
         if (found) {
            form.setValue("countryCode", found.code, { shouldDirty: true, shouldTouch: true });
            form.setValue("countryName", found.label, {
               shouldDirty: true,
               shouldValidate: true,
               shouldTouch: true,
            });
         }
      }

      if (buyer.postalCode && buyer.city && buyer.latitude && buyer.longitude) {
         form.setValue("postalCode", buyer.postalCode, { shouldDirty: true, shouldTouch: true });
         form.setValue("city", buyer.city, { shouldDirty: true, shouldTouch: true });
         form.setValue("latitude", buyer.latitude, { shouldDirty: true, shouldTouch: true });
         form.setValue("longitude", buyer.longitude, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true,
         });
      }

      if (buyer.address) {
         form.setValue("address", buyer.address, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
         });
      }
   }, [session, form]);

   function onSubmit(data: DeliveryData) {
      console.log("You submitted the following values", data);
      setDeliveryData(data);
      const lastUnlockedPath = stepToPath[lastUnlockedStep ?? 3];
      router.push(lastUnlockedPath as StaticPathname);
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-full max-w-lg flex-col justify-between gap-4"
         >
            <div className="space-y-4">
               <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                     <FormItem className="mb-8 space-y-1">
                        <FormLabel>{t("Delivery type")}</FormLabel>
                        <RadioGroup
                           onValueChange={field.onChange}
                           value={field.value}
                           className="grid grid-cols-2 gap-4 focus-within:[&:has(:focus-visible)]:ring-2 focus-within:[&:has(:focus-visible)]:ring-ring focus-within:[&:has(:focus-visible)]:ring-offset-4"
                        >
                           <RadioGroupItemCard value="homeDelivery" label={t("home delivery")} />
                           <RadioGroupItemCard value="pickup" label={t("pickup")} />
                        </RadioGroup>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <CountryField />
               <PostalCodeField />

               {deliveryMethod === "homeDelivery" && (
                  <FormField
                     control={form.control}
                     name="address"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>{t("Address")}</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               )}
            </div>

            <StickyFooter>
               <BackButtonLink href="/request-offers/firewood" label={t("Back")} size="lg" />
               <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
                  {t("Continue")}
               </Button>
            </StickyFooter>
         </form>
         <FormStoreSyncManager
            formData={deliveryData}
            setFormDataToStore={setDeliveryData}
            defaultValues={defaultValues}
         />
      </Form>
   );
}
