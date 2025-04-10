"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { BackButtonLink } from "@/components/ui/back-button-link";
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
import { SessionWithBuyer } from "@/lib/auth/types";

import { PhoneField } from "../../../../../../components/ui/phone-field";
import { useContactData, useSetContactData } from "../../../_store/request-offers-store-provider";
import { FormStoreSyncManager } from "../../_components/form-store-sync-manager";
import { StickyFooter } from "../../_components/sticky-footer";

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

export function ContactForm({ session }: Readonly<{ session: SessionWithBuyer }>) {
   const contactData = useContactData();
   const t = useTranslations();
   const router = useRouter();
   const setContactData = useSetContactData();

   const defaultValues: DefaultValues<ContactData> = contactData ?? {
      name: session?.buyer?.name ?? "",
      email: session?.buyer?.email ?? "",
      phone: session?.buyer?.phone ?? "",
      isCompany: false,
      companyName: session?.buyer?.companyName ?? "",
   };

   const form = useForm<ContactData>({
      resolver: zodResolver(contactFormSchema),
      defaultValues,
   });

   const isCompany = form.watch("isCompany");

   const canProceed = form.formState.isValid;

   // This updates the values in the form if the user signs in and has buyer data
   useEffect(() => {
      if (!session) return;
      const { buyer } = session;
      if (!buyer) return;

      if (buyer.name) {
         form.setValue("name", buyer.name, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
         });
      }
      if (buyer.email) {
         form.setValue("email", buyer.email, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
         });
      }
      if (buyer.phone) {
         form.setValue("phone", buyer.phone, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
         });
      }
      if (buyer.companyName) {
         form.setValue("companyName", buyer.companyName, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
         });
      }
   }, [session, form]);

   function onSubmit(data: ContactData) {
      console.log("You submitted the following values", data);
      setContactData(data);
      router.push("/request-offers/submit");
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-full max-w-lg flex-1 flex-col justify-between gap-4"
         >
            <div className="space-y-4">
               <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>{t("form-labels.Full name")}</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              placeholder={t("request-offers.Full name placeholder")}
                           />
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
                        <FormLabel>{t("form-labels.Email")}</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              inputMode="email"
                              placeholder={t("request-offers.Type your email")}
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
               <PhoneField name="phone" label={t("form-labels.Phone")} />
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
                              {t("form-labels.Buy as a company")}
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
                              <FormLabel>{t("form-labels.Company name")}</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder={t("request-offers.Insert company name")}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  )}
               </div>
            </div>

            <StickyFooter>
               <BackButtonLink
                  href="/request-offers/delivery"
                  label={t("actions.Back")}
                  size="lg"
               />
               <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
                  {t("actions.Continue")}
               </Button>
            </StickyFooter>
         </form>
         <FormStoreSyncManager
            formData={contactData}
            setFormDataToStore={setContactData}
            defaultValues={defaultValues}
         />
      </Form>
   );
}
