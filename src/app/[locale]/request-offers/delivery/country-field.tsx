"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { DeliveryData } from "./delivery-form";

const countries = [{ label: "Finland", value: "FI" }] as const;

export function CountryField() {
   const t = useTranslations();
   const form = useFormContext<DeliveryData>();

   return (
      <FormField
         control={form.control}
         name="country"
         render={({ field }) => (
            <FormItem className="flex flex-col">
               <FormLabel>{t("request-offers.Country")}</FormLabel>
               <Popover>
                  <PopoverTrigger asChild>
                     <FormControl>
                        <Button
                           variant="outline"
                           role="combobox"
                           className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                           )}
                        >
                           {field.value
                              ? t(
                                   `countries.${
                                      countries.find((country) => country.value === field.value)
                                         ?.label
                                   }`
                                )
                              : t("request-offers.Select country")}{" "}
                           {field.value && `– ${field.value}`}
                           <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                     </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                     <Command>
                        <CommandInput
                           placeholder={t("request-offers.Search country")}
                           className="h-9"
                        />
                        <CommandList>
                           <CommandEmpty>{t("request-offers.No country found")}</CommandEmpty>
                           <CommandGroup>
                              {countries.map((country) => (
                                 <CommandItem
                                    value={country.label}
                                    key={country.value}
                                    keywords={[
                                       country.label,
                                       t(`countries.${country.label}`),
                                       country.value,
                                    ]}
                                    onSelect={() => {
                                       form.setValue("country", country.value);
                                       form.setValue("countryName", country.label);
                                    }}
                                 >
                                    {`${t(`countries.${country.label}`)} – ${country.value}`}
                                    <CheckIcon
                                       className={cn(
                                          "ml-auto h-4 w-4",
                                          country.value === field.value
                                             ? "opacity-100"
                                             : "opacity-0"
                                       )}
                                    />
                                 </CommandItem>
                              ))}
                           </CommandGroup>
                        </CommandList>
                     </Command>
                  </PopoverContent>
               </Popover>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
