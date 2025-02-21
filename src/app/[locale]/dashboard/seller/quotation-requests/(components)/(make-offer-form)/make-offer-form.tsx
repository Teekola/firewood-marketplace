"use client";

import { ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Currency } from "@prisma/client";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormRootError } from "@/components/ui/form";
import { countryCodeToCurrency } from "@/i18n/currencies";
import { parseError } from "@/lib/utils/errors";
import "@/lib/utils/unit-conversions";

import { CurrencyField } from "./currency-field";

export const makeOfferFormSchema = z.object({
   price: z.string().min(1, "Please, enter the price"),
   currency: z.nativeEnum(Currency),
});

export type MakeOfferFormData = z.infer<typeof makeOfferFormSchema>;

interface MakeOfferFormProps extends ComponentProps<"form"> {
   countryCode: string;
}

export function MakeOfferForm({ countryCode, ...props }: MakeOfferFormProps) {
   const t = useTranslations();

   const defaultValues: DefaultValues<MakeOfferFormData> = {
      price: "",
      currency: (countryCodeToCurrency[countryCode] ?? Currency.EUR) as Currency,
   };

   const form = useForm<MakeOfferFormData>({
      resolver: zodResolver(makeOfferFormSchema),
      defaultValues,
   });

   const canProceed = form.formState.isValid && form.formState.isDirty;

   async function onSubmit(data: MakeOfferFormData) {
      if (!canProceed) return;

      try {
         form.reset(data);
         // TODO: CREATE THE OFFER
         // TODO: Display message stating that the offer was made and provide link to "see offer"
         // TODO: make the not viewed offer indicator
      } catch (error) {
         const errorData = parseError(error);
         form.reset(defaultValues);
         form.setError("root", { type: "upsertSellerProfileError", message: errorData.message });
      }
   }

   return (
      <Form {...form}>
         <form
            {...props}
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-full max-w-lg flex-1 flex-col gap-4"
         >
            <CurrencyField />

            <Button type="submit" size="lg" data-disabled={!canProceed} className="mt-4 sm:w-fit">
               {t("actions.Submit")}
            </Button>
            <FormRootError />
         </form>
      </Form>
   );
}
