"use client";

import { ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { PhoneField } from "@/app/[locale]/request-offers/(stepper)/contact/phone-field";
import { Button } from "@/components/ui/button";
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
import { parseError } from "@/lib/utils/errors";
import { Nullable } from "@/lib/utils/types";
import "@/lib/utils/unit-conversions";

import { upsertSellerProfile } from "./actions";
import { sellerProfileQueryKey } from "./constants";

export const sellerProfileFormSchema = z.object({
   name: z.string().min(1, "Name is required"),
   email: z.string().min(1, "Email is required").email("The email is invalid"),
   phone: z.string().min(7, "The phone number is invalid").max(15, "The phone number is invalid"),
});

export type SellerProfileFormData = z.infer<typeof sellerProfileFormSchema>;

interface SellerProfileFormProps extends ComponentProps<"form"> {
   sellerProfile: Nullable<SellerProfileFormData> | null;
}

export function SellerProfileForm({ sellerProfile, ...props }: SellerProfileFormProps) {
   const t = useTranslations("dashboard");
   const queryClient = useQueryClient();

   const defaultValues: DefaultValues<SellerProfileFormData> = {
      name: sellerProfile?.name ?? "",
      email: sellerProfile?.email ?? "",
      phone: sellerProfile?.phone ?? "",
   };

   const form = useForm<SellerProfileFormData>({
      resolver: zodResolver(sellerProfileFormSchema),
      defaultValues,
   });

   const canProceed = form.formState.isValid && form.formState.isDirty;

   async function onSubmit(data: SellerProfileFormData) {
      if (!canProceed) return;
      try {
         form.reset(data);
         await upsertSellerProfile(data);
         queryClient.invalidateQueries({ queryKey: sellerProfileQueryKey });
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
            <div className="space-y-4">
               <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>{t("profile.Seller name")}</FormLabel>
                        <FormControl>
                           <Input {...field} />
                        </FormControl>
                        <FormDescription>{t("profile.Seller name instruction")}</FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>{t("profile.Email")}</FormLabel>
                        <FormControl>
                           <Input {...field} inputMode="email" />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <PhoneField />
            </div>
            <Button type="submit" size="lg" data-disabled={!canProceed} className="mt-4 sm:w-fit">
               {t("actions.Save")}
            </Button>
            <FormRootError />
         </form>
      </Form>
   );
}
