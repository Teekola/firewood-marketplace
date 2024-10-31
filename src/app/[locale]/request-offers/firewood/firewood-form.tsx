"use client";

import { ChangeEvent, ComponentProps, FocusEvent, ReactNode } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm, useFormContext } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FirewoodFormSchema = z.object({
   woodType: z.enum(["mixed", "birch", "pine"], { required_error: "Please, select a wood type" }),
   dryness: z.enum(["any", "dry", "green"], { required_error: "Please, select a dryness level" }),
   amount: z.string().min(1, { message: "Insert a valid number" }),
   maxLength: z.string().optional(),
});

export function FirewoodForm() {
   const form = useForm<z.infer<typeof FirewoodFormSchema>>({
      resolver: zodResolver(FirewoodFormSchema),
      defaultValues: {
         woodType: "mixed",
         dryness: "any",
         amount: "",
         maxLength: "",
      },
   });

   const t = useTranslations("request-offers");

   function onSubmit(data: z.infer<typeof FirewoodFormSchema>) {
      console.log("You submitted the following values", data);
   }

   const canProceed = form.formState.isValid && form.formState.isDirty;

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-lg space-y-6">
            <FormField
               control={form.control}
               name="woodType"
               render={({ field }) => (
                  <FormItem className="space-y-1">
                     <FormLabel>{t("Wood type")}</FormLabel>
                     <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                     >
                        <RadioGroupItemCard value="mixed" label="Mixed" />
                        <RadioGroupItemCard value="birch" label="Birch" />
                        <RadioGroupItemCard value="pine" label="Pine" />
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
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                     >
                        <RadioGroupItemCard value="any" label="Any" />
                        <RadioGroupItemCard value="dry" label="Dry" />
                        <RadioGroupItemCard value="green" label="Green" />
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
      </Form>
   );
}

interface RadioGroupItemCardProps extends ComponentProps<typeof FormItem> {
   value: string;
   label: string;
   icon?: ReactNode;
}
function RadioGroupItemCard({ value, label, icon, ...props }: RadioGroupItemCardProps) {
   return (
      <FormItem {...props}>
         <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
            <FormControl>
               <RadioGroupItem value={value} className="sr-only" />
            </FormControl>
            <div className="flex h-28 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-secondary p-1 hover:border-accent">
               {icon}
               {label}
            </div>
         </FormLabel>
      </FormItem>
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
   const form = useFormContext<z.infer<typeof FirewoodFormSchema>>();

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
                     placeholder="Insert"
                     inputClassName="mr-6"
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
   const form = useFormContext<z.infer<typeof FirewoodFormSchema>>();

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
                     placeholder="Insert"
                     inputClassName="mr-5"
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
