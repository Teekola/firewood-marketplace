"use client";

import { useState } from "react";

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
import { countries } from "@/i18n/constants/countries";
import { cn } from "@/lib/utils";

interface CountryFieldProps extends React.HTMLAttributes<HTMLDivElement> {
   name: string;
   countryNameField: string;
   onCountrySelect?: (selected: { code: string; label: string }) => void;
}

export function CountryField({
   name,
   countryNameField,
   onCountrySelect,
   ...props
}: Readonly<CountryFieldProps>) {
   const [isOpen, setOpen] = useState(false);
   const t = useTranslations();
   const form = useFormContext();

   return (
      <FormField
         control={form.control}
         name={name}
         render={({ field }) => (
            <FormItem {...props} className={cn("flex flex-col", props.className)}>
               <FormLabel>{t("request-offers.Country")}</FormLabel>
               <Popover open={isOpen}>
                  <PopoverTrigger asChild>
                     <FormControl>
                        <Button
                           variant="outline"
                           role="combobox"
                           className={cn(
                              "w-auto justify-between text-foreground",
                              "focus-visible:border-primary focus-visible:ring-0",
                              !field.value && "text-foreground-muted"
                           )}
                           onClick={() => setOpen((prev) => !prev)}
                        >
                           {field.value
                              ? t(
                                   `countries.${
                                      countries.find((country) => country.code === field.value)
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
                                    key={country.code}
                                    keywords={[
                                       country.label,
                                       t(`countries.${country.label}`),
                                       country.code,
                                    ]}
                                    className="cursor-pointer"
                                    onSelect={() => {
                                       form.setValue(countryNameField, country.label, {
                                          shouldDirty: true,
                                          shouldTouch: true,
                                       });
                                       form.setValue(name, country.code, {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                          shouldTouch: true,
                                       });
                                       onCountrySelect?.(country);
                                       setOpen(false);
                                    }}
                                 >
                                    {`${t(`countries.${country.label}`)} – ${country.code}`}
                                    <CheckIcon
                                       className={cn(
                                          "ml-auto h-4 w-4",
                                          country.code === field.value ? "opacity-100" : "opacity-0"
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
