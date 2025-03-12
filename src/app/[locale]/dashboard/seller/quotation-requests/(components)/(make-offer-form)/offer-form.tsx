"use client";

import { ComponentProps, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Currency } from "@prisma/client";
import { fi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { countryCodeToCurrency } from "@/i18n/currencies";
import { Link, Pathname, StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { parseError } from "@/lib/utils/errors";
import "@/lib/utils/unit-conversions";

import { CurrencyField } from "./currency-field";

export const offerFormSchema = z.object({
   price: z.string().min(1, "Please, enter the price"),
   currency: z.nativeEnum(Currency),
   earliestAvailability: z.date(),
});

export type OfferFormData = z.infer<typeof offerFormSchema>;

interface OfferFormProps extends ComponentProps<"form"> {
   countryCode: string;
   isHomeDelivery: boolean;

   defaultValues?: Partial<OfferFormData>;
   cancelHref: { pathname: Exclude<Pathname, StaticPathname>; params: { id: string } };
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

   const defaultValues: DefaultValues<OfferFormData> = propDefaultValues ?? {
      price: "",
      currency: (countryCodeToCurrency[countryCode] ?? Currency.EUR) as Currency,
      earliestAvailability: new Date(),
   };

   const form = useForm<OfferFormData>({
      resolver: zodResolver(offerFormSchema),
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
            className="mt-4 flex h-full max-w-lg flex-1 flex-col gap-4 text-left"
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

            <div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
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
         </form>
      </Form>
   );
}
