"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

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
import { useRouter } from "@/i18n/routing";

import { FormStoreSyncManager } from "../(components)/form-store-sync-manager";
import { RadioGroupItemCard } from "../(components)/radio-group-item-card";
import { stepToPath } from "../(components)/use-step-manager";
import {
   useDeliveryData,
   useLastUnlockedStep,
   useSetDeliveryData,
} from "../(store)/request-offers-store-provider";
import { CountryField } from "./country-field";
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

export function DeliveryForm() {
   const deliveryData = useDeliveryData();
   const lastUnlockedStep = useLastUnlockedStep();

   const defaultValues: DefaultValues<DeliveryData> = deliveryData ?? {
      deliveryMethod: "homeDelivery",
      countryCode: "FI", // TODO: Get these from buyer
      countryName: "Finland",
      postalCode: "",
      city: "",
      address: "",
   };

   const form = useForm<DeliveryData>({
      resolver: zodResolver(deliveryFormSchema),
      defaultValues,
   });

   const t = useTranslations();

   const router = useRouter();
   const deliveryMethod = form.watch("deliveryMethod");

   const setDeliveryData = useSetDeliveryData();

   function onSubmit(data: DeliveryData) {
      console.log("You submitted the following values", data);
      setDeliveryData(data);
      const lastUnlockedPath = stepToPath[lastUnlockedStep ?? 3];
      router.push(lastUnlockedPath);
   }

   const canProceed = form.formState.isValid;

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-full max-w-lg flex-1 flex-col justify-between gap-4"
         >
            <div className="space-y-4">
               <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                     <FormItem className="mb-8 space-y-1">
                        <FormLabel>{t("request-offers.Delivery type")}</FormLabel>
                        <RadioGroup
                           onValueChange={field.onChange}
                           value={field.value}
                           className="grid grid-cols-2 gap-4 focus-within:[&:has(:focus-visible)]:ring-2 focus-within:[&:has(:focus-visible)]:ring-ring focus-within:[&:has(:focus-visible)]:ring-offset-4"
                        >
                           <RadioGroupItemCard
                              value="homeDelivery"
                              label={t("request-offers.home delivery")}
                           />
                           <RadioGroupItemCard value="pickup" label={t("request-offers.pickup")} />
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

            <div className="flex gap-2">
               <BackButtonLink
                  href="/request-offers/firewood"
                  size="lg"
                  label={t("request-offers.Back")}
               />
               <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
                  {t("request-offers.Continue")}
               </Button>
            </div>
         </form>
         <FormStoreSyncManager
            formData={deliveryData}
            setFormDataToStore={setDeliveryData}
            defaultValues={defaultValues}
         />
      </Form>
   );
}
