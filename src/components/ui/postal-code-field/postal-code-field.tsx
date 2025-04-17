"use client";

import React, { ChangeEvent, FocusEvent, useEffect, useState } from "react";

import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { useDebounce, useDebouncedCallback } from "use-debounce";

import { DeliveryData } from "@/app/[locale]/request-offers/(stepper)/delivery/_components/delivery-form";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputWithContent } from "@/components/ui/input-with-content";
import { parsePostalCodeFile } from "@/components/ui/postal-code-field/parse-postal-code-file";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Utility to fetch postal codes
const POSTAL_CODES_BASE_URL = "https://polttopuutori-postal-codes.s3.eu-north-1.amazonaws.com";
async function fetchPostalCodesByCountryCode(countryCode: DeliveryData["countryCode"]) {
   const response = await fetch(`${POSTAL_CODES_BASE_URL}/${countryCode}.txt`, {
      cache: "force-cache",
      next: { revalidate: 86400 }, // Cache for 1 day
   });
   const text = await response.text();
   return parsePostalCodeFile(text);
}

interface PostalCodeFieldProps extends React.HTMLAttributes<HTMLDivElement> {
   name: string;
   label: string;
   countryField: string;
   cityField: string;
   disabled?: boolean;
   fetchPostalCodes?: (
      countryCode: DeliveryData["countryCode"]
   ) => Promise<{ postalCode: string; placeName: string; latitude: number; longitude: number }[]>;
   onPostalCodeSelect?: (selected: {
      postalCode: string;
      placeName: string;
      latitude: number;
      longitude: number;
   }) => void;
}

export function PostalCodeField({
   name,
   label,
   countryField,
   cityField,
   disabled,
   fetchPostalCodes = fetchPostalCodesByCountryCode,
   onPostalCodeSelect,
   ...props
}: PostalCodeFieldProps) {
   const [isOpen, setOpen] = useState(false);
   const form = useFormContext();
   const inputValue = form.watch(name);
   const countryCode = form.watch(countryField);
   const [filteredPostalCodes, setFilteredPostalCodes] = useState<
      { postalCode: string; placeName: string; latitude: number; longitude: number }[]
   >([]);
   const [debouncedInputValue] = useDebounce(inputValue, 100);
   const [debouncedFilteredPostalCodes] = useDebounce(filteredPostalCodes, 300);
   const t = useTranslations("request-offers");
   const cityValue = form.watch(cityField);

   // Fetch postal codes when countryCode changes
   const {
      data: postalCodes,
      isLoading,
      isError,
   } = useQuery({
      queryKey: ["postalCodes", countryCode],
      queryFn: () => fetchPostalCodes(countryCode),
      enabled: !!countryCode,
   });

   // Update filtered postal codes when input changes
   useEffect(() => {
      if (!postalCodes || isLoading || isError) return;
      if (!debouncedInputValue) {
         setFilteredPostalCodes(postalCodes.slice(0, 7));
         return;
      }
      const filtered = postalCodes.filter(({ postalCode }) =>
         postalCode.toLowerCase().startsWith(debouncedInputValue.toLowerCase())
      );
      setFilteredPostalCodes(filtered.slice(0, 7));

      const fullMatch = filtered.find((obj) => obj.postalCode === debouncedInputValue);
      if (fullMatch) setOpen(false);
   }, [debouncedInputValue, postalCodes, isError, isLoading]);

   const isValid = inputValue === filteredPostalCodes[0]?.postalCode;

   const handleInputChange = useDebouncedCallback(
      (e: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
         const correctPostalCode = filteredPostalCodes.find(
            (obj) => obj.postalCode === e.target.value
         );
         if (correctPostalCode) {
            setOpen(false);
            form.setValue(cityField, correctPostalCode.placeName, {
               shouldDirty: true,
               shouldTouch: true,
            });
            form.setValue(name, correctPostalCode.postalCode, {
               shouldValidate: true,
               shouldDirty: true,
               shouldTouch: true,
            });
            onPostalCodeSelect?.(correctPostalCode);
            return;
         }
         if (cityField !== "") {
            form.setValue(cityField, "", {
               shouldDirty: true,
               shouldTouch: true,
               shouldValidate: true,
            });
         }

         if (!isOpen) setOpen(true);
      },
      200
   );

   return (
      <FormField
         control={form.control}
         name={name}
         render={({ field }) => (
            <FormItem {...props}>
               <FormLabel>{label}</FormLabel>
               <Command className="relative h-auto overflow-visible bg-transparent">
                  <div className="flex w-full items-center gap-4">
                     <div className="flex w-full min-w-[150px] max-w-[150px] flex-wrap items-center justify-between gap-4 sm:max-w-[60%]">
                        <FormControl>
                           <CommandPrimitive.Input asChild>
                              <InputWithContent
                                 {...field}
                                 className="max-w-sm"
                                 autoComplete="off"
                                 inputMode="numeric"
                                 disabled={disabled}
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
                                    isValid && (
                                       <CheckCircledIcon className="mx-3 h-6 w-6 text-green-600" />
                                    )
                                 }
                              />
                           </CommandPrimitive.Input>
                        </FormControl>
                     </div>
                     <p className="text-xs xs:text-sm">{cityValue}</p>
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
                                    onMouseDown={(e) => e.preventDefault()}
                                    onSelect={() => {
                                       form.setValue(cityField, placeName, {
                                          shouldDirty: true,
                                          shouldTouch: true,
                                       });
                                       form.setValue(name, postalCode, {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                          shouldTouch: true,
                                       });
                                       onPostalCodeSelect?.({
                                          postalCode,
                                          placeName,
                                          latitude,
                                          longitude,
                                       });
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
