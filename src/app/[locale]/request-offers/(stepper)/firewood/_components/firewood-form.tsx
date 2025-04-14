"use client";

import { ChangeEvent, FocusEvent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { WoodDryness, WoodType } from "@prisma/client";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

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
import { InputWithContent } from "@/components/ui/input-with-content";
import { useUser } from "@/hooks/user-store";
import {
   imperialWoodAmountUnit,
   imperialWoodLengthUnit,
   metricWoodAmountUnit,
   metricWoodLengthUnit,
} from "@/i18n/constants/units";
import { StaticPathname, useRouter } from "@/i18n/routing";

import {
   useFirewoodData,
   useLastUnlockedStep,
   useSetFirewoodData,
} from "../../../_store/request-offers-store-provider";
import { FormStoreSyncManager } from "../../_components/form-store-sync-manager";
import { StickyFooter } from "../../_components/sticky-footer";
import { stepToPath } from "../../_hooks/use-step-manager";

export const firewoodFormSchema = z.object({
   woodTypes: z.array(z.nativeEnum(WoodType)).nonempty("Please select a wood type"),
   dryness: z
      .array(z.nativeEnum(WoodDryness))
      .nonempty({ message: "Please select a dryness level" }),
   amount: z
      .string()
      .min(1, { message: "Insert a valid number" })
      .refine((v) => Number(v.replace(",", ".")) > 0, { message: "Insert a valid number" }),
   maxLength: z
      .string()
      .default("")
      .refine(
         (v) => {
            if (v === "") return true;
            if (Number(v.replace(",", ".")) > 0) return true;
            return false;
         },
         { message: "Insert a valid number" }
      ),
});
export type FirewoodData = z.infer<typeof firewoodFormSchema>;

const woodTypes = Object.keys(WoodType) as WoodType[];
const woodDrynesses = Object.keys(WoodDryness) as WoodDryness[];

export function FirewoodForm() {
   const firewoodData = useFirewoodData();
   const lastUnlockedStep = useLastUnlockedStep();

   const defaultValues: DefaultValues<FirewoodData> = firewoodData ?? {
      woodTypes: [],
      dryness: [],
      amount: "",
      maxLength: "",
   };

   const form = useForm<FirewoodData>({
      resolver: zodResolver(firewoodFormSchema),
      defaultValues,
   });

   const canProceed = form.formState.isValid;

   const t = useTranslations();
   const router = useRouter();

   const setFirewoodData = useSetFirewoodData();

   function onSubmit(data: FirewoodData) {
      console.log("You submitted the following values", data);
      setFirewoodData(data);
      const lastUnlockedPath = stepToPath[lastUnlockedStep ?? 2];
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
                  name="woodTypes"
                  render={({ field }) => (
                     <FormItem className="space-y-1">
                        <FormLabel>
                           {t("request-offers.Wood type")}{" "}
                           {`(${t("request-offers.Select at least one")})`}
                        </FormLabel>
                        <div className="grid grid-cols-3 gap-2">
                           {woodTypes.map((woodType) => (
                              <CheckboxGroupItemCard
                                 key={woodType}
                                 label={t(`wood-types.${woodType}`)}
                                 checked={field.value.includes(woodType)}
                                 onChange={() =>
                                    field.onChange(
                                       field.value.includes(woodType)
                                          ? field.value.filter((v) => v !== woodType) // Remove if it was checked
                                          : [...field.value, woodType] // Add if it was not checked
                                    )
                                 }
                              />
                           ))}
                        </div>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="dryness"
                  render={({ field }) => (
                     <FormItem className="space-y-1">
                        <FormLabel>
                           {t("request-offers.Dryness")}{" "}
                           {`(${t("request-offers.Select at least one")})`}
                        </FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                           {woodDrynesses.map((woodDryness) => (
                              <CheckboxGroupItemCard
                                 key={woodDryness}
                                 label={t(`wood-drynesses.${woodDryness}`)}
                                 checked={field.value.includes(woodDryness)}
                                 onChange={() =>
                                    field.onChange(
                                       field.value.includes(woodDryness)
                                          ? field.value.filter((v) => v !== woodDryness) // Remove if it was checked
                                          : [...field.value, woodDryness] // Add if it was not checked
                                    )
                                 }
                              />
                           ))}
                        </div>

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
                  {t("actions.Continue")}
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

   // Prevent leading zeros unless followed by a decimal separator
   if (/^0[0-9]+/.test(filteredValue) && decimalIndex === -1) {
      filteredValue = filteredValue.replace(/^0+/, "");
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
