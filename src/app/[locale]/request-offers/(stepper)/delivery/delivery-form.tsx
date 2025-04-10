"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { DeliveryMethod } from "@prisma/client";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { BackButtonLink } from "@/components/ui/back-button-link";
import { Button } from "@/components/ui/button";
import { CheckboxGroupItemCard } from "@/components/ui/checkbox-group-item-card";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGeolocationData } from "@/hooks/use-geolocation-data";
import { StaticPathname, useRouter } from "@/i18n/routing";
import { SessionWithBuyer } from "@/lib/auth/types";

import { FormStoreSyncManager } from "../../_components/form-store-sync-manager";
import { StickyFooter } from "../../_components/sticky-footer";
import { stepToPath } from "../../_components/use-step-manager";
import {
   useDeliveryData,
   useLastUnlockedStep,
   useSetDeliveryData,
} from "../../_store/request-offers-store-provider";
import { CountryField, DEFAULT_COUNTRY, countries } from "./country-field";
import { PostalCodeField } from "./postal-code-field";

export const deliveryFormSchema = z
   .object({
      deliveryMethods: z
         .array(z.nativeEnum(DeliveryMethod))
         .nonempty({ message: "Select at least one delivery method" }),
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
         if (data.deliveryMethods.includes(DeliveryMethod.HOME_DELIVERY) && !data.address) {
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

const deliveryMethodOptions = Object.keys(DeliveryMethod) as DeliveryMethod[];

export function DeliveryForm({ session }: Readonly<{ session: SessionWithBuyer }>) {
   const deliveryData = useDeliveryData();
   const lastUnlockedStep = useLastUnlockedStep();
   const geolocationData = useGeolocationData();
   const t = useTranslations();
   const router = useRouter();
   const setDeliveryData = useSetDeliveryData();

   // Only use the country code if it is a valid option
   const countryCode = session?.buyer?.countryCode
      ? session.buyer.countryCode
      : geolocationData.country;
   const validCountryCode = countries.find((country) => country.code === countryCode);

   const defaultValues: DefaultValues<DeliveryData> = deliveryData ?? {
      deliveryMethods: [],
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

   const deliveryMethods = form.watch("deliveryMethods");

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
                  name="deliveryMethods"
                  render={({ field }) => (
                     <FormItem className="mb-8 space-y-1">
                        <FormLabel>
                           {t("request-offers.Delivery type")}{" "}
                           <span>{`(${t("request-offers.Select at least one")})`}</span>
                        </FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                           {deliveryMethodOptions.map((deliveryMethod) => (
                              <CheckboxGroupItemCard
                                 key={deliveryMethod}
                                 label={t(`delivery-methods.${deliveryMethod}`)}
                                 checked={field.value.includes(deliveryMethod)}
                                 onChange={() =>
                                    field.onChange(
                                       field.value.includes(deliveryMethod)
                                          ? field.value.filter((v) => v !== deliveryMethod) // Remove if it was checked
                                          : [...field.value, deliveryMethod] // Add if it was not checked
                                    )
                                 }
                              />
                           ))}
                        </div>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <CountryField />
               <PostalCodeField />

               {deliveryMethods.includes(DeliveryMethod.HOME_DELIVERY) && (
                  <FormField
                     control={form.control}
                     name="address"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>{t("request-offers.Address")}</FormLabel>
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
               <BackButtonLink
                  href="/request-offers/firewood"
                  label={t("actions.Back")}
                  size="lg"
               />
               <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
                  {t("actions.Continue")}
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
