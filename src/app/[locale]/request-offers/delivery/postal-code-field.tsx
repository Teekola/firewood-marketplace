"use client";

import React, { ChangeEvent, FocusEvent, useEffect, useState } from "react";

import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Command as CommandPrimitive } from "cmdk";
import postalCodes from "datasets-fi-postalcodes";
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

const postalCodeArrayFI = Object.keys(postalCodes)
   .map((code) => ({
      code,
      name: postalCodes[code] as string,
   }))
   .sort((a, b) => (a.code < b.code ? -1 : a.code > b.code ? 1 : a.name > b.name ? -1 : 1));

type PostalCodeFieldProps = React.HTMLAttributes<HTMLDivElement>;

export function PostalCodeField({ ...props }: PostalCodeFieldProps) {
   const [isOpen, setOpen] = useState(false);
   const [currentName, setCurrentName] = useState("");
   const [filteredPostalCodes, setFilteredPostalCodes] = useState<typeof postalCodeArrayFI>(
      postalCodeArrayFI.slice(0, 5)
   );
   const form = useFormContext<DeliveryData>();
   const inputValue = form.watch("postalCode");
   const cityValue = form.watch("city");
   const [debouncedInputValue] = useDebounce(inputValue, 100);
   const [debouncedFilteredPostalCodes] = useDebounce(filteredPostalCodes, 300);
   const t = useTranslations("request-offers");

   const isValid = inputValue === filteredPostalCodes[0]?.code;

   const handleInputChange = useDebouncedCallback(
      (e: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
         const fullCode = filteredPostalCodes.find((obj) => obj.code === e.target.value);

         if (fullCode) {
            setOpen(false);
            setCurrentName(fullCode.name);
            form.setValue("city", fullCode.name);
            return;
         }
         setCurrentName("");
         if (cityValue !== "") {
            form.setValue("city", "");
         }
         if (!isOpen) setOpen(true);
      },
      200
   );

   // Update filtered postal codes based on input value
   useEffect(() => {
      if (!debouncedInputValue) {
         setFilteredPostalCodes(postalCodeArrayFI.slice(0, 7));
         return;
      }

      const filtered = postalCodeArrayFI.filter(({ code }) =>
         code.toLowerCase().startsWith(debouncedInputValue.toLowerCase())
      );
      setFilteredPostalCodes(filtered.slice(0, 7));

      const fullCode = filtered.find((obj) => obj.code === debouncedInputValue);

      if (fullCode) {
         setOpen(false);
         setCurrentName(fullCode.name);
         return;
      }
   }, [debouncedInputValue]);

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
                                    handleInputChange(e);
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
                           {filteredPostalCodes.map(({ code, name }) => (
                              <CommandItem
                                 key={code}
                                 value={code}
                                 // Allows selecting options without input blur firing and closing the menu
                                 onMouseDown={(e) => e.preventDefault()}
                                 onSelect={(currentValue) => {
                                    if (currentValue === inputValue) {
                                       return;
                                    }
                                    form.setValue("city", name);
                                    form.setValue("postalCode", currentValue, {
                                       shouldValidate: true,
                                       shouldDirty: true,
                                       shouldTouch: true,
                                    });

                                    setCurrentName(name);
                                    setOpen(false);
                                 }}
                                 className="flex items-center justify-between"
                              >
                                 {code} {name}
                                 <Check
                                    className={cn(
                                       "mr-2 h-4 w-4",
                                       inputValue === code ? "opacity-100" : "opacity-0"
                                    )}
                                 />
                              </CommandItem>
                           ))}
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
