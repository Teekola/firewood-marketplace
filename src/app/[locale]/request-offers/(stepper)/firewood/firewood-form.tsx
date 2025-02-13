"use client";

import { ChangeEvent, FocusEvent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { useUser } from "@/components/auth/user-store-provider";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { InputWithContent } from "@/components/ui/input-with-content";
import { RadioGroup } from "@/components/ui/radio-group";
import { useRouter } from "@/i18n/routing";
import {
   imperialWoodAmountUnit,
   imperialWoodLengthUnit,
   metricWoodAmountUnit,
   metricWoodLengthUnit,
} from "@/lib/utils/units";

import { FormStoreSyncManager } from "../../(components)/form-store-sync-manager";
import { RadioGroupItemCard } from "../../(components)/radio-group-item-card";
import { StickyFooter } from "../../(components)/sticky-footer";
import { stepToPath } from "../../(components)/use-step-manager";
import {
   useFirewoodData,
   useLastUnlockedStep,
   useSetFirewoodData,
} from "../../(store)/request-offers-store-provider";

export const firewoodFormSchema = z.object({
   woodType: z.enum(["mixed", "birch", "pine"], { required_error: "Please, select a wood type" }),
   dryness: z.enum(["any", "dry", "green"], { required_error: "Please, select a dryness level" }),
   amount: z.string().min(1, { message: "Insert a valid number" }),
   maxLength: z.string().default(""),
});
export type FirewoodData = z.infer<typeof firewoodFormSchema>;

export function FirewoodForm() {
   const firewoodData = useFirewoodData();
   const lastUnlockedStep = useLastUnlockedStep();

   const defaultValues: DefaultValues<FirewoodData> = firewoodData ?? {
      woodType: "mixed",
      dryness: "any",
      amount: "",
      maxLength: "",
   };

   const form = useForm<FirewoodData>({
      resolver: zodResolver(firewoodFormSchema),
      defaultValues,
   });

   const canProceed = form.formState.isValid;

   const t = useTranslations("request-offers");
   const router = useRouter();

   const setFirewoodData = useSetFirewoodData();

   function onSubmit(data: FirewoodData) {
      console.log("You submitted the following values", data);
      setFirewoodData(data);
      const lastUnlockedPath = stepToPath[lastUnlockedStep ?? 2];
      router.push(lastUnlockedPath);
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
                  name="woodType"
                  render={({ field }) => (
                     <FormItem className="space-y-1">
                        <FormLabel>{t("Wood type")}</FormLabel>
                        <RadioGroup
                           onValueChange={field.onChange}
                           value={field.value}
                           className="grid grid-cols-3 gap-4 focus-within:[&:has(:focus-visible)]:ring-2 focus-within:[&:has(:focus-visible)]:ring-ring focus-within:[&:has(:focus-visible)]:ring-offset-4"
                        >
                           <RadioGroupItemCard value="mixed" label={t("mixed")} />
                           <RadioGroupItemCard value="birch" label={t("birch")} />
                           <RadioGroupItemCard value="pine" label={t("pine")} />
                        </RadioGroup>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="dryness"
                  render={({ field }) => (
                     <FormItem className="space-y-1">
                        <FormLabel>{t("Dryness")}</FormLabel>
                        <RadioGroup
                           onValueChange={field.onChange}
                           value={field.value}
                           className="grid grid-cols-3 gap-4 focus-within:[&:has(:focus-visible)]:ring-2 focus-within:[&:has(:focus-visible)]:ring-ring focus-within:[&:has(:focus-visible)]:ring-offset-4"
                        >
                           <RadioGroupItemCard value="any" label={t("any")} />
                           <RadioGroupItemCard value="dry" label={t("dry")} />
                           <RadioGroupItemCard value="green" label={t("green")} />
                        </RadioGroup>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <div className="flex w-full flex-wrap justify-between gap-3 xs:flex-nowrap">
                  <VolumeField />
                  <MaxLengthField />
               </div>
            </div>

            <StickyFooter>
               <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
                  {t("Continue")}
               </Button>
            </StickyFooter>
         </form>
         <FormStoreSyncManager
            formData={firewoodData}
            setFormDataToStore={setFirewoodData}
            defaultValues={defaultValues}
         />
      </Form>
   );
}

const dotRegex = /\./g;
const commaRegex = /\,/g;

function transformDecimalInputValue(input: string, decimalSeparator = ",") {
   const replaceRegex = decimalSeparator === "," ? dotRegex : commaRegex;
   let filteredValue = input.replace(/[^0-9.,]/g, "").replace(replaceRegex, decimalSeparator);

   const decimalIndex = filteredValue.indexOf(decimalSeparator);

   const limitToOneRegex = decimalSeparator === "," ? commaRegex : dotRegex;
   // Allow only one comma
   filteredValue =
      filteredValue.slice(0, decimalIndex + 1) +
      filteredValue.slice(decimalIndex + 1).replace(limitToOneRegex, "");

   if (decimalIndex === 0) {
      filteredValue = filteredValue.replace(decimalSeparator, "");
   }
   return filteredValue;
}

function VolumeField() {
   const fieldName = "amount";
   const t = useTranslations("request-offers");
   const form = useFormContext<FirewoodData>();

   const user = useUser();
   const unit =
      user.preferredUnitSystem === "METRIC" ? metricWoodAmountUnit : imperialWoodAmountUnit;
   const decimalSeparator = user.preferredUnitSystem === "METRIC" ? "," : ".";

   // Transform input value to contain numbers and decimal separator only
   function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      const value = transformDecimalInputValue(e.target.value, decimalSeparator);

      form.setValue(fieldName, value, {
         shouldDirty: true,
         shouldTouch: true,
         shouldValidate: true,
      });
   }

   // If , is last char, remove it
   function handleBlur(e: FocusEvent<HTMLInputElement, Element>) {
      const value = e.target.value;
      if (value[value.length - 1] === decimalSeparator) {
         form.setValue(fieldName, value.slice(0, -1), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
         });
      }
   }
   return (
      <FormField
         control={form.control}
         name={fieldName}
         render={({ field }) => (
            <FormItem className="w-full">
               <FormLabel>{t("Amount")}</FormLabel>
               <FormControl>
                  <InputWithContent
                     placeholder="0,0"
                     inputClassName="mr-8 text-right"
                     inputMode="decimal"
                     {...field}
                     onChange={handleInputChange}
                     onBlur={handleBlur}
                     content={
                        <p className="absolute right-4 text-base">
                           {unit}
                           <span className="-translate-y-1/5 absolute text-xs">{"3"}</span>
                        </p>
                     }
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}

function MaxLengthField() {
   const fieldName = "maxLength";
   const t = useTranslations("request-offers");
   const form = useFormContext<FirewoodData>();

   const user = useUser();
   const unit =
      user.preferredUnitSystem === "METRIC" ? metricWoodLengthUnit : imperialWoodLengthUnit;
   const decimalSeparator = user.preferredUnitSystem === "METRIC" ? "," : ".";

   // Transform input value to contain numbers and decimal separator only
   function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      const value = transformDecimalInputValue(e.target.value, decimalSeparator);

      form.setValue(fieldName, value, {
         shouldDirty: true,
         shouldTouch: true,
         shouldValidate: true,
      });
   }

   // If , is last char, remove it
   function handleBlur(e: FocusEvent<HTMLInputElement, Element>) {
      const value = e.target.value;
      if (value[value.length - 1] === decimalSeparator) {
         form.setValue(fieldName, value.slice(0, -1), {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
         });
      }
   }
   return (
      <FormField
         control={form.control}
         name={fieldName}
         render={({ field }) => (
            <FormItem className="w-full">
               <FormLabel className="whitespace-nowrap">
                  {t("Max length")} {`(${t("Optional")})`}
               </FormLabel>
               <FormControl>
                  <InputWithContent
                     inputClassName="mr-8 text-right"
                     {...field}
                     inputMode="decimal"
                     onChange={handleInputChange}
                     onBlur={handleBlur}
                     content={<p className="absolute right-2 text-base">{unit}</p>}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
