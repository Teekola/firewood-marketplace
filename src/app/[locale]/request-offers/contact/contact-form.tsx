"use client";

import { ChangeEvent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@/i18n/routing";

import { FormStoreSyncManager } from "../(components)/form-store-sync-manager";
import {
   useContactData,
   useIsHydrated,
   useSetContactData,
} from "../store/request-offers-store-provider";

export const contactFormSchema = z.object({
   name: z.string().min(1, "Name is required"),
   email: z.string().email("The email is invalid"),
   phone: z.string().min(7, "The phone number is invalid").max(15, "The phone number is invalid"),
});

export type ContactData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
   const contactData = useContactData();
   const isHydrated = useIsHydrated();

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

   if (!isHydrated) {
      return <Skeleton className="mt-4 h-60 w-full max-w-lg space-y-6" />;
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 max-w-lg space-y-4">
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
                        <Input {...field} placeholder={t("Type your email")} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <PhoneField />
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

function PhoneField() {
   const form = useFormContext<ContactData>();
   const t = useTranslations("request-offers");
   const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      let masked = "";

      // Allow only + and digits for the first character
      if (value.length > 0) {
         masked += value[0]?.replace(/[^\d|\+]/g, "") ?? "";
      }
      // Allow only digits for other characters
      masked += value.substring(1).replace(/[^\d]/g, "");

      // Validate only when the error might need to be removed or added
      const shouldValidate = form.formState.errors["phone"]
         ? (masked.length >= 6 && masked.length <= 15) || masked.length < 1
         : masked.length === 0 || masked.length > 15;

      form.setValue("phone", masked, { shouldValidate, shouldDirty: true, shouldTouch: true });
   };

   return (
      <FormField
         name="phone"
         control={form.control}
         render={({ field }) => (
            <FormItem className="w-full">
               <FormLabel>{t("Phone")}</FormLabel>
               <FormControl>
                  <Input
                     {...field}
                     onChange={handlePhoneChange}
                     placeholder={t("Type your phone number")}
                  />
               </FormControl>
               <FormDescription>{t("You may use any format")}</FormDescription>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
