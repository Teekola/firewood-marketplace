"use client";

import { ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
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
   FormRootError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneField } from "@/components/ui/phone-field";
import "@/i18n/utils/unit-conversions";
import { cn } from "@/lib/utils";
import { parseError } from "@/lib/utils/errors";
import { Nullable } from "@/lib/utils/types";

import { upsertSellerProfile } from "./actions";
import { sellerProfileQueryKey } from "./constants";

export const sellerProfileFormSchema = z.object({
   name: z.string().min(1, "Name is required"),
   email: z.string().min(1, "Email is required").email("The email is invalid"),
   phone: z.string().min(7, "The phone number is invalid").max(15, "The phone number is invalid"),
});

export type SellerProfileFormData = z.infer<typeof sellerProfileFormSchema>;

interface SellerProfileFormProps extends ComponentProps<"form"> {
   sellerProfile?: Nullable<SellerProfileFormData> | null;
   isLoading?: boolean;
}

export function SellerProfileForm({ sellerProfile, isLoading, ...props }: SellerProfileFormProps) {
   const t = useTranslations();
   const queryClient = useQueryClient();

   const defaultValues: DefaultValues<SellerProfileFormData> = {
      name: isLoading ? " " : (sellerProfile?.name ?? ""),
      email: isLoading ? " " : (sellerProfile?.email ?? ""),
      phone: isLoading ? " " : (sellerProfile?.phone ?? ""),
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
                  disabled={isLoading}
                  control={form.control}
                  render={({ field }) => (
                     <FormItem className={cn("w-full", isLoading && "animate-pulse")}>
                        <FormLabel>{t("dashboard.profile.Seller name")}</FormLabel>
                        <FormControl>
                           <Input {...field} />
                        </FormControl>
                        <FormDescription>
                           {t("dashboard.profile.Seller name instruction")}
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  name="email"
                  disabled={isLoading}
                  control={form.control}
                  render={({ field }) => (
                     <FormItem className={cn("w-full", isLoading && "animate-pulse")}>
                        <FormLabel>{t("form-labels.email")}</FormLabel>
                        <FormControl>
                           <Input {...field} inputMode="email" />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <PhoneField
                  name="phone"
                  label={t("form-labels.Phone")}
                  disabled={isLoading}
                  className={cn(isLoading && "animate-pulse")}
               />
            </div>
            <Button
               type="submit"
               size="lg"
               data-disabled={!canProceed}
               disabled={isLoading}
               className={cn("mt-4 sm:w-fit", isLoading && "animate-pulse")}
            >
               {t("actions.Save")}
            </Button>
            <FormRootError />
         </form>
      </Form>
   );
}
