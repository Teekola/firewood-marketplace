"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { useUser } from "@/components/auth/user-store-provider";
import { BackButtonLink } from "@/components/back-button-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useContactData, useSetContactData } from "../(store)/request-offers-store-provider";
import { PhoneField } from "./phone-field";

export const contactFormSchema = z
   .object({
      name: z.string().min(1, "Name is required"),
      email: z.string().min(1, "Email is required").email("The email is invalid"),
      phone: z
         .string()
         .min(7, "The phone number is invalid")
         .max(15, "The phone number is invalid"),
      isCompany: z.boolean().default(false),
      companyName: z.string().optional(),
   })
   .refine(
      (data) => {
         if (data.isCompany && !data.companyName) {
            return false;
         }
         return true;
      },
      {
         message: "Insert company name",
         path: ["companyName"],
      }
   );

export type ContactData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
   const contactData = useContactData();
   const user = useUser();

   // TODO: Get these from buyer
   const defaultValues: DefaultValues<ContactData> = contactData ?? {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: "",
      isCompany: false,
      companyName: "",
   };

   const form = useForm<ContactData>({
      resolver: zodResolver(contactFormSchema),
      defaultValues,
   });

   const isCompany = form.watch("isCompany");
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
               <div className="space-y-2">
                  <FormField
                     control={form.control}
                     name="isCompany"
                     render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-md">
                           <FormControl>
                              <Checkbox
                                 checked={field.value}
                                 className="h-5 w-5"
                                 onCheckedChange={field.onChange}
                              />
                           </FormControl>

                           <FormLabel className="cursor-pointer leading-none">
                              {t("Buy as a company")}
                           </FormLabel>
                        </FormItem>
                     )}
                  />
                  {isCompany && (
                     <FormField
                        name="companyName"
                        control={form.control}
                        render={({ field }) => (
                           <FormItem className="w-full">
                              <FormLabel>{t("Company name")}</FormLabel>
                              <FormControl>
                                 <Input {...field} placeholder={t("Insert company name")} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  )}
               </div>
            </div>
            <div className="flex gap-2">
               <BackButtonLink href="/request-offers/delivery" label={t("Back")} size="lg" />
               <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
                  {t("Continue")}
               </Button>
            </div>
         </form>
         <FormStoreSyncManager
            formData={contactData}
            setFormDataToStore={setContactData}
            defaultValues={defaultValues}
         />
      </Form>
   );
}
