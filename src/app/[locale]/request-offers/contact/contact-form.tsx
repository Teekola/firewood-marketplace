"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";

import { FormStoreSyncManager } from "../(components)/form-store-sync-manager";
import { useContactData, useSetContactData } from "../store/request-offers-store-provider";
import { PhoneField } from "./phone-field";

export const contactFormSchema = z.object({
   name: z.string().min(1, "Name is required"),
   email: z.string().min(1, "Email is required").email("The email is invalid"),
   phone: z.string().min(7, "The phone number is invalid").max(15, "The phone number is invalid"),
});

export type ContactData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
   const contactData = useContactData();

   // TODO: Get these from the user profile
   const defaultValues: DefaultValues<ContactData> = contactData ?? {
      name: "",
      email: "",
      phone: "",
   };

   const form = useForm<ContactData>({
      resolver: zodResolver(contactFormSchema),
      defaultValues,
   });

   const t = useTranslations("request-offers");
   const router = useRouter();

   const setContactData = useSetContactData();

   function onSubmit(data: ContactData) {
      console.log("You submitted the following values", data);
      setContactData(data);
      router.push("/request-offers/submit");
   }

   const canProceed = form.formState.isValid;

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-full max-w-lg flex-1 flex-col justify-between gap-4"
         >
            <div className="space-y-6">
               <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>{t("Full name")}</FormLabel>
                        <FormControl>
                           <Input {...field} placeholder={t("Full name placeholder")} />
                        </FormControl>

                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>{t("Email")}</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              inputMode="email"
                              placeholder={t("Type your email")}
                              onBlur={() => {
                                 field.onBlur();
                                 form.trigger(field.name);
                              }}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <PhoneField />
            </div>
            <Button type="submit" size="lg" className="!mt-12 w-full" data-disabled={!canProceed}>
               {t("Continue")}
            </Button>
         </form>
         <FormStoreSyncManager
            formData={contactData}
            setFormDataToStore={setContactData}
            defaultValues={defaultValues}
         />
      </Form>
   );
}
