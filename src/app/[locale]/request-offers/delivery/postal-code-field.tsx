"use client";

import React, { ChangeEvent, FocusEvent, useEffect, useState } from "react";

import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { useDebounce, useDebouncedCallback } from "use-debounce";

import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputWithContent } from "@/components/ui/input-with-content";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { DeliveryData } from "./delivery-form";
import { parsePostalCodeFile } from "./parse-postal-code-file";

// TODO: Add credits link to GeoNames so that use is legal!
const POSTAL_CODES_BASE_URL = "https://polttopuutori-postal-codes.s3.eu-north-1.amazonaws.com";

async function fetchPostalCodesByCountryCode(countryCode: DeliveryData["countryCode"]) {
   const response = await fetch(`${POSTAL_CODES_BASE_URL}/${countryCode}.txt`, {
      cache: "force-cache",
      next: { revalidate: 86400 }, // Cache for 1 day
   });
   const text = await response.text();
   return parsePostalCodeFile(text);
}

type PostalCodeFieldProps = React.HTMLAttributes<HTMLDivElement>;

export function PostalCodeField({ ...props }: PostalCodeFieldProps) {
   const [isOpen, setOpen] = useState(false);
   const [currentName, setCurrentName] = useState("");

   const form = useFormContext<DeliveryData>();
   const inputValue = form.watch("postalCode");
   const cityValue = form.watch("city");
   const countryCode = form.watch("countryCode");

   const {
      data: postalCodes,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ["postalCodes", countryCode],
      queryFn: async () => fetchPostalCodesByCountryCode(countryCode),
      enabled: !!countryCode,
   });
   const [filteredPostalCodes, setFilteredPostalCodes] = useState(postalCodes?.slice(0, 7) ?? []);

   const [debouncedInputValue] = useDebounce(inputValue, 100);
   const [debouncedFilteredPostalCodes] = useDebounce(filteredPostalCodes, 300);
   const t = useTranslations("request-offers");

   const isValid = inputValue === filteredPostalCodes[0]?.postalCode;

   const handleInputChange = useDebouncedCallback(
      (e: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
         const correctPostalCodeInfo = filteredPostalCodes.find(
            (obj) => obj.postalCode === e.target.value
         );

         if (correctPostalCodeInfo) {
            setOpen(false);
            setCurrentName(correctPostalCodeInfo.placeName);
            form.setValue("city", correctPostalCodeInfo.placeName);
            form.setValue("latitude", correctPostalCodeInfo.latitude);
            form.setValue("longitude", correctPostalCodeInfo.longitude, {
               shouldValidate: true,
               shouldDirty: true,
               shouldTouch: true,
            });
            return;
         }
         setCurrentName("");
         if (cityValue !== "") {
            form.setValue("city", "");
            form.resetField("latitude");
            form.resetField("longitude");
         }
         if (!isOpen) setOpen(true);
      },
      200
   );

   // Update filtered postal codes based on input value
   useEffect(() => {
      if (!postalCodes || isLoading || isError) {
         // TODO: Handle this case
         return;
      }
      if (!debouncedInputValue) {
         setFilteredPostalCodes(postalCodes.slice(0, 7));
         return;
      }

      const filtered = postalCodes.filter(({ postalCode }) =>
         postalCode.toLowerCase().startsWith(debouncedInputValue.toLowerCase())
      );
      setFilteredPostalCodes(filtered.slice(0, 7));

      const fullCode = filtered.find((obj) => obj.postalCode === debouncedInputValue);

      if (fullCode) {
         setOpen(false);
         setCurrentName(fullCode.placeName);
         return;
      }
   }, [debouncedInputValue, postalCodes, isError, isLoading]);

   return (
      <FormField
         control={form.control}
         name="postalCode"
         render={({ field }) => (
            <FormItem {...props}>
               <FormLabel>{t("Postal code")}</FormLabel>
               <Command className="relative h-auto overflow-visible bg-transparent">
                  <div className="flex w-full items-center gap-4">
                     <div className="flex w-full min-w-[150px] max-w-[150px] flex-wrap items-center justify-between gap-4 sm:max-w-[60%]">
                        <FormControl>
                           <CommandPrimitive.Input asChild>
                              <InputWithContent
                                 {...field}
                                 className="max-w-sm"
                                 autoComplete="off"
                                 type="tel"
                                 onFocus={(e) => {
                                    if (e.currentTarget.value.length > 0) {
                                       handleInputChange(e);
                                    }
                                 }}
                                 onChange={(e) => {
                                    field.onChange(e);
                                    handleInputChange(e);
                                 }}
                                 onBlur={() => {
                                    field.onBlur();
                                    setOpen(false);
                                 }}
                                 content={
                                    <>
                                       {isValid && (
                                          <CheckCircledIcon className="mx-3 h-6 w-6 text-green-600" />
                                       )}
                                    </>
                                 }
                              />
                           </CommandPrimitive.Input>
                        </FormControl>
                     </div>
                     <p className="text-xs xs:text-sm">{currentName}</p>
                  </div>

                  <div className="relative">
                     <CommandList
                        className={cn(
                           "absolute top-0 z-20 mt-1 hidden w-full rounded-sm bg-card shadow transition-all animate-in fade-in-0 zoom-in-95 sm:max-w-[60%]",
                           isOpen && "block"
                        )}
                     >
                        {filteredPostalCodes.length < 1 &&
                           debouncedFilteredPostalCodes.length > 0 && (
                              <CommandPrimitive.Loading className="p-1">
                                 <Skeleton className="h-8 w-full" />
                              </CommandPrimitive.Loading>
                           )}
                        {debouncedFilteredPostalCodes.length < 1 && (
                           <CommandEmpty>{t("Invalid postal code")}</CommandEmpty>
                        )}
                        <CommandGroup>
                           {filteredPostalCodes.map(
                              ({ postalCode, placeName, latitude, longitude }) => (
                                 <CommandItem
                                    key={postalCode}
                                    value={postalCode}
                                    // Allows selecting options without input blur firing and closing the menu
                                    onMouseDown={(e) => e.preventDefault()}
                                    onSelect={(currentValue) => {
                                       if (currentValue === inputValue) {
                                          return;
                                       }
                                       form.setValue("city", placeName);
                                       form.setValue("latitude", latitude);
                                       form.setValue("longitude", longitude);
                                       form.setValue("postalCode", currentValue, {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                          shouldTouch: true,
                                       });

                                       setCurrentName(placeName);
                                       setOpen(false);
                                    }}
                                    className="flex items-center justify-between"
                                 >
                                    {postalCode} {placeName}
                                    <Check
                                       className={cn(
                                          "mr-2 h-4 w-4",
                                          inputValue === postalCode ? "opacity-100" : "opacity-0"
                                       )}
                                    />
                                 </CommandItem>
                              )
                           )}
                        </CommandGroup>
                     </CommandList>
                  </div>
               </Command>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
