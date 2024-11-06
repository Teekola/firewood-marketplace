"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { FormStoreSyncManager } from "../(components)/form-store-sync-manager";
import { PostalCodeField } from "../(components)/postal-code-field";
import { RadioGroupItemCard } from "../(components)/radio-group-item-card";
import {
   useDeliveryData,
   useIsHydrated,
   useSetDeliveryData,
} from "../store/request-offers-store-provider";

export const deliveryFormSchema = z
   .object({
      deliveryMethod: z.enum(["homeDelivery", "pickup"], {
         required_error: "Please, select a delivery method",
      }),
      country: z.string(),
      postalCode: z.string().min(5, { message: "Invalid postal code" }),
      address: z.string().optional(),
   })
   .refine(
      (data) => {
         if (data.deliveryMethod === "homeDelivery" && !data.address) {
            return false;
         }
         return true;
      },
      {
         message: "Address is required for home delivery",
         path: ["address"],
      }
   );
export type DeliveryData = z.infer<typeof deliveryFormSchema>;

const countries = [{ label: "Finland", value: "FI" }] as const;

export function DeliveryForm() {
   const deliveryData = useDeliveryData();
   const isHydrated = useIsHydrated();

   // TODO: get the defaults from the user profile information!
   const defaultValues: DefaultValues<DeliveryData> = deliveryData ?? {
      deliveryMethod: "homeDelivery",
      country: "FI",
      postalCode: "",
      address: "",
   };

   const form = useForm<DeliveryData>({
      resolver: zodResolver(deliveryFormSchema),
      defaultValues,
   });

   const t = useTranslations("request-offers");
   const router = useRouter();
   const deliveryMethod = form.watch("deliveryMethod");

   const setDeliveryData = useSetDeliveryData();

   function onSubmit(data: DeliveryData) {
      console.log("You submitted the following values", data);
      setDeliveryData(data);
      router.push("/request-offers/contact");
   }

   const canProceed = form.formState.isValid;

   if (!isHydrated) {
      return <Skeleton className="mt-4 h-60 w-full max-w-lg space-y-6" />;
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 max-w-lg space-y-4">
            <FormField
               control={form.control}
               name="deliveryMethod"
               render={({ field }) => (
                  <FormItem className="space-y-1">
                     <FormLabel>{t("Wood type")}</FormLabel>
                     <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 gap-4 focus-within:[&:has(:focus-visible)]:ring-2 focus-within:[&:has(:focus-visible)]:ring-ring focus-within:[&:has(:focus-visible)]:ring-offset-4"
                     >
                        <RadioGroupItemCard value="homeDelivery" label={t("Home delivery")} />
                        <RadioGroupItemCard value="pickup" label={t("Pickup")} />
                     </RadioGroup>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="country"
               render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <FormLabel>{t("Country")}</FormLabel>
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
                                         countries.find((country) => country.value === field.value)
                                            ?.label
                                      )
                                    : t("Select country")}{" "}
                                 {field.value && `– ${field.value}`}
                                 <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                           </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                           <Command>
                              <CommandInput placeholder={t("Search country")} className="h-9" />
                              <CommandList>
                                 <CommandEmpty>{t("No country found")}</CommandEmpty>
                                 <CommandGroup>
                                    {countries.map((country) => (
                                       <CommandItem
                                          value={country.label}
                                          key={country.value}
                                          onSelect={() => {
                                             form.setValue("country", country.value);
                                          }}
                                       >
                                          {`${t(country.label)} – ${country.value}`}
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

            <PostalCodeField />

            {deliveryMethod === "homeDelivery" && (
               <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>{t("Address")}</FormLabel>
                        <FormControl>
                           <Input {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            )}

            <Button type="submit" size="lg" className="!mt-12 w-full" data-disabled={!canProceed}>
               {t("Continue")}
            </Button>
         </form>
         <FormStoreSyncManager
            formData={deliveryData}
            setFormDataToStore={setDeliveryData}
            defaultValues={defaultValues}
         />
      </Form>
   );
}
