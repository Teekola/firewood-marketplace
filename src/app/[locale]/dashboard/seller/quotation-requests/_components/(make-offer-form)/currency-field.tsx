"use client";

import { Currency } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   CurrencyConfigs,
   currencyConfigs as baseCurrencyConfigs,
} from "@/i18n/constants/currencies";
import { cn } from "@/lib/utils";

import { OfferFormData } from "./offer-form";

export function CurrencyField() {
   const { control, setValue, watch } = useFormContext<OfferFormData>();
   const t = useTranslations("");
   const currency = watch("currency");
   const price = watch("price");

   const currencyConfigs = Object.entries(baseCurrencyConfigs).reduce((acc, [key, config]) => {
      acc[key as keyof CurrencyConfigs] = {
         ...config,
         label: `${t(`currencies.label-${key}`)} (${config.symbol})`,
      };
      return acc;
   }, {} as CurrencyConfigs);

   const { symbol, decimalSeparator, symbolPosition } = currencyConfigs[currency];

   const formatPrice = (value: string) => {
      let sanitizedValue = value.replace(/[^0-9.,]/g, ""); // Allow only digits and separators

      // Standardize to "." for processing
      sanitizedValue = sanitizedValue.replaceAll(",", ".");

      // Ensure only one decimal separator
      const parts = sanitizedValue.split(".");

      if (parts.length > 2) {
         sanitizedValue = parts.slice(0, -1).join("") + "." + parts[parts.length - 1]; // Keep only the last separator
      }

      // Prevent leading zeros unless it's "0."
      if (/^0\d/.test(sanitizedValue)) {
         sanitizedValue = sanitizedValue.replace(/^0+/, "");
      }

      // Convert back to correct separator for the selected currency
      sanitizedValue = sanitizedValue.replace(".", decimalSeparator);

      return sanitizedValue;
   };

   const enforceTwoDecimals = (value: string, newCurrency?: Currency) => {
      const numericValue = value.replace(",", ".");
      if (numericValue === "") return "";

      const floatValue = parseFloat(numericValue);
      if (isNaN(floatValue)) return "";

      let formattedValue = floatValue.toFixed(2); // Always show 2 decimals
      const currentCurrency = newCurrency ?? currency;
      if (currentCurrency === "EUR") {
         formattedValue = formattedValue.replace(".", ","); // Convert back if EUR
      }
      return formattedValue;
   };

   const handlePriceChange = (value: string, fieldOnChange: (val: string) => void) => {
      const formattedValue = formatPrice(value);
      fieldOnChange(formattedValue);
   };

   const handlePriceBlur = (value: string, fieldOnChange: (val: string) => void) => {
      const formattedValue = enforceTwoDecimals(value);
      fieldOnChange(formattedValue);
   };

   const handleCurrencyChange = (newCurrency: Currency) => {
      if (newCurrency === currency) return;

      const oldSeparator = currencyConfigs[currency].decimalSeparator;
      const newSeparator = currencyConfigs[newCurrency].decimalSeparator;
      let updatedPrice = price;
      updatedPrice = updatedPrice.replace(oldSeparator, newSeparator);

      setValue("currency", newCurrency, { shouldValidate: true });
      setValue("price", enforceTwoDecimals(updatedPrice, newCurrency), { shouldValidate: true });
   };

   return (
      <FormItem className="w-full">
         <FormLabel>{t("offer.Price")}</FormLabel>
         <div
            className={cn(
               "flex flex-row items-center",
               symbolPosition === "before" && "flex-row-reverse"
            )}
         >
            <FormField
               control={control}
               name="price"
               render={({ field }) => (
                  <FormControl>
                     <Input
                        {...field}
                        inputMode="numeric"
                        value={field.value}
                        onChange={(e) => handlePriceChange(e.target.value, field.onChange)}
                        onBlur={(e) => handlePriceBlur(e.target.value, field.onChange)}
                        className={cn(
                           "rounded-none",
                           symbolPosition === "after" && "rounded-l text-right",
                           symbolPosition === "before" && "rounded-r text-left"
                        )}
                     />
                  </FormControl>
               )}
            />
            <FormMessage />

            <FormField
               control={control}
               name="currency"
               render={({ field }) => (
                  <FormControl>
                     <Select
                        value={field.value}
                        onValueChange={(value) => handleCurrencyChange(value as Currency)}
                     >
                        <SelectTrigger
                           className={cn(
                              "flex w-12 gap-2 rounded-none border bg-transparent px-2 shadow-none",

                              symbolPosition === "after" && "rounded-r border-l-0",
                              symbolPosition === "before" && "rounded-l border-r-0"
                           )}
                        >
                           <SelectValue>
                              <span className="text-foreground-muted">{symbol}</span>
                           </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                           {Object.entries(currencyConfigs).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>
                                 {label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </FormControl>
               )}
            />
         </div>
      </FormItem>
   );
}
