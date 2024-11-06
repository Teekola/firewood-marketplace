"use client";

import { ChangeEvent, FocusEvent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

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
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@/i18n/routing";

import { FormStoreSyncManager } from "../(components)/form-store-sync-manager";
import { RadioGroupItemCard } from "../(components)/radio-group-item-card";
import {
   useFirewoodData,
   useIsHydrated,
   useSetFirewoodData,
} from "../store/request-offers-store-provider";

export const firewoodFormSchema = z.object({
   woodType: z.enum(["mixed", "birch", "pine"], { required_error: "Please, select a wood type" }),
   dryness: z.enum(["any", "dry", "green"], { required_error: "Please, select a dryness level" }),
   amount: z.string().min(1, { message: "Insert a valid number" }),
   maxLength: z.string().default(""),
});
export type FirewoodData = z.infer<typeof firewoodFormSchema>;

export function FirewoodForm() {
   const firewoodData = useFirewoodData();
   const isHydrated = useIsHydrated();

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

   const t = useTranslations("request-offers");
   const router = useRouter();

   const setFirewoodData = useSetFirewoodData();

   function onSubmit(data: FirewoodData) {
      console.log("You submitted the following values", data);
      setFirewoodData(data);
      router.push("/request-offers/delivery");
   }

   const canProceed = form.formState.isValid;

   if (!isHydrated) {
      return <Skeleton className="mt-4 h-60 w-full max-w-lg space-y-6" />;
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 max-w-lg space-y-6">
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
                        <RadioGroupItemCard value="mixed" label={t("Mixed")} />
                        <RadioGroupItemCard value="birch" label={t("Birch")} />
                        <RadioGroupItemCard value="pine" label={t("Pine")} />
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
                        <RadioGroupItemCard value="any" label={t("Any")} />
                        <RadioGroupItemCard value="dry" label={t("Dry")} />
                        <RadioGroupItemCard value="green" label={t("Green")} />
                     </RadioGroup>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="flex w-full flex-wrap justify-between gap-3 xs:flex-nowrap">
               <CubicMetresField />
               <MaxLengthField />
            </div>

            <Button type="submit" size="lg" className="!mt-12 w-full" data-disabled={!canProceed}>
               {t("Continue")}
            </Button>
         </form>
         <FormStoreSyncManager
            formData={firewoodData}
            setFormDataToStore={setFirewoodData}
            defaultValues={defaultValues}
         />
      </Form>
   );
}

function transformDecimalInputValue(input: string) {
   let filteredValue = input.replace(/[^0-9.,]/g, "").replace(/\./g, ",");

   const decimalIndex = filteredValue.indexOf(",");

   // Allow only one comma
   filteredValue =
      filteredValue.slice(0, decimalIndex + 1) +
      filteredValue.slice(decimalIndex + 1).replace(/\,/g, "");

   if (decimalIndex === 0) {
      filteredValue = filteredValue.replace(",", "");
   }
   return filteredValue;
}

function CubicMetresField() {
   const fieldName = "amount";
   const t = useTranslations("request-offers");
   const form = useFormContext<FirewoodData>();

   // Transform input value to contain numbers and decimal separator only
   function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      const value = transformDecimalInputValue(e.target.value);

      form.setValue(fieldName, value, {
         shouldDirty: true,
         shouldTouch: true,
         shouldValidate: true,
      });
   }

   // If , is last char, remove it
   function handleBlur(e: FocusEvent<HTMLInputElement, Element>) {
      const value = e.target.value;
      if (value[value.length - 1] === ",") {
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
                     {...field}
                     onChange={handleInputChange}
                     onBlur={handleBlur}
                     content={
                        <p className="absolute right-4 text-base">
                           {"m"}
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

   // Transform input value to contain numbers and decimal separator only
   function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
      const value = transformDecimalInputValue(e.target.value);

      form.setValue(fieldName, value, {
         shouldDirty: true,
         shouldTouch: true,
         shouldValidate: true,
      });
   }

   // If , is last char, remove it
   function handleBlur(e: FocusEvent<HTMLInputElement, Element>) {
      const value = e.target.value;
      if (value[value.length - 1] === ",") {
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
                     onChange={handleInputChange}
                     onBlur={handleBlur}
                     content={<p className="absolute right-2 text-base">{"cm"}</p>}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
