"use client";

import { ComponentProps, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Currency } from "@prisma/client";
import { fi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Calendar } from "@/components/ui/calendar";
import { CountryField, countries } from "@/components/ui/country-field";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormRootError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PostalCodeField } from "@/components/ui/postal-code-field";
import { countryCodeToCurrency } from "@/i18n/currencies";
import { Link, SingleDynamicPathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { parseError } from "@/lib/utils/errors";
import "@/lib/utils/unit-conversions";

import { CurrencyField } from "./currency-field";

export const offerFormSchema = (isHomeDelivery: boolean) =>
   z.object({
      price: z.string().min(1, "Please, enter the price"),
      currency: z.nativeEnum(Currency),
      earliestAvailability: z.date(),
      pickupCountryCode: !isHomeDelivery
         ? z.string().min(1, "Please enter the country code")
         : z.string().optional(),
      pickupCountryName: !isHomeDelivery
         ? z.string().min(1, "Please enter the country name")
         : z.string().optional(),
      pickupPostalCode: !isHomeDelivery
         ? z.string().min(1, "Please enter the postal code")
         : z.string().optional(),
      pickupCity: !isHomeDelivery
         ? z.string().min(1, "Please enter the city")
         : z.string().optional(),
      pickupAddress: !isHomeDelivery
         ? z.string().min(1, "Please enter the address")
         : z.string().optional(),
   });

export type OfferFormData = z.infer<ReturnType<typeof offerFormSchema>>;

interface OfferFormProps extends ComponentProps<"form"> {
   countryCode: string;
   isHomeDelivery: boolean;
   defaultValues?: Partial<OfferFormData>;
   cancelHref: { pathname: SingleDynamicPathname; params: { id: string } };
   handleSubmit: (data: OfferFormData) => Promise<void>;
}

export function OfferForm({
   countryCode,
   isHomeDelivery,
   defaultValues: propDefaultValues,
   cancelHref,
   handleSubmit,
   ...props
}: OfferFormProps) {
   const t = useTranslations();
   const format = useFormatter();
   const locale = useLocale();
   const [isSubmitting, setIsSubmitting] = useState(false);

   const schema = offerFormSchema(isHomeDelivery);

   // TODO: Get default pickup location values from SellerLocation!
   const defaultValues: DefaultValues<z.infer<typeof schema>> = propDefaultValues ?? {
      price: "",
      currency: (countryCodeToCurrency[countryCode] ?? Currency.EUR) as Currency,
      earliestAvailability: new Date(),
      pickupCountryCode: countries[0].code,
      pickupCountryName: countries[0].label,
      pickupAddress: "",
      pickupPostalCode: "",
      pickupCity: "",
   };

   const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues,
   });

   const canProceed = form.formState.isValid && form.formState.isDirty;

   async function onSubmit(data: OfferFormData) {
      if (!canProceed) return;
      setIsSubmitting(true);

      try {
         await handleSubmit(data);
         form.reset(data);
      } catch (error) {
         setIsSubmitting(false);
         const errorData = parseError(error);
         form.setError("root", { type: "offerFormError", message: errorData.message });
      }
   }

   return (
      <Form {...form}>
         <form
            {...props}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full max-w-lg flex-1 flex-col gap-4 text-left"
         >
            <CurrencyField />

            <FormField
               control={form.control}
               name="earliestAvailability"
               render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <FormLabel>
                        {isHomeDelivery
                           ? t("offer.Earliest delivery date")
                           : t("offer.Earliest pickup date")}
                     </FormLabel>
                     <Popover modal={true}>
                        <PopoverTrigger asChild>
                           <FormControl>
                              <Button
                                 variant={"outline"}
                                 className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                 )}
                              >
                                 {field.value ? (
                                    format.dateTime(field.value, {
                                       year: "numeric",
                                       month: "numeric",
                                       day: "numeric",
                                       timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                                    })
                                 ) : (
                                    <span>{t("offer.Pick a date")}</span>
                                 )}
                                 <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                           </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                              {...(locale === "fi" && { locale: fi })}
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                           />
                        </PopoverContent>
                     </Popover>
                     <FormDescription>
                        {isHomeDelivery
                           ? t(
                                "offer.Select the earliest availability of the firewood to be delivered"
                             )
                           : t(
                                "offer.Select the earliest availability of the firewood to be picked up"
                             )}
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />

            {!isHomeDelivery && (
               <div className="flex flex-col gap-4">
                  <h3 className="h4 mt-4 border-t pt-4">{t("offer.Pickup location")}</h3>
                  <CountryField
                     name="pickupCountryCode"
                     countryNameField="pickupCountryName"
                     onCountrySelect={({ label }) => {
                        form.setValue("pickupCountryName", label, { shouldDirty: true });
                        form.setValue("pickupPostalCode", "", { shouldDirty: true });
                        form.setValue("pickupCity", "", { shouldDirty: true });
                     }}
                  />
                  <PostalCodeField
                     name="pickupPostalCode"
                     cityField="pickupCity"
                     countryField="pickupCountryCode"
                  />
                  <FormField
                     control={form.control}
                     name="pickupAddress"
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>{t("offer.Address")}</FormLabel>
                           <FormControl>
                              <Input {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
            )}

            <div className="sticky bottom-0 mt-4">
               <div
                  className="pointer-events-none h-8 w-full bg-gradient-to-b from-transparent via-background to-background"
                  aria-hidden="true"
               ></div>
               <div className="flex flex-col gap-2 bg-background sm:flex-row-reverse">
                  {!isSubmitting && (
                     <Button type="submit" size="lg" data-disabled={!canProceed} className="w-full">
                        {t("actions.Submit")}
                     </Button>
                  )}
                  {isSubmitting && <ButtonLoading size="lg" className="w-full" />}
                  <Button asChild size="lg" variant="outline" type="button" className="w-full">
                     <Link href={cancelHref}>{t("actions.Cancel")}</Link>
                  </Button>
               </div>

               <FormRootError />
            </div>
         </form>
      </Form>
   );
}
