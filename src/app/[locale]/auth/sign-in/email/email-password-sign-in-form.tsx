"use client";

import { ComponentProps, useState } from "react";

import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
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
import { PasswordInput } from "@/components/ui/password-input";
import { getValidHref, useRouter } from "@/i18n/routing";
import "@/lib/utils/unit-conversions";

export const emailPasswordRegistrationFormSchema = z.object({
   username: z.string().min(1, "Email is required").email("The email is invalid"),
   password: z.string().min(8, "The password is too short"),
});

export type SellerProfileFormData = z.infer<typeof emailPasswordRegistrationFormSchema>;

type EmailPasswordRegistrationFormProps = ComponentProps<"form">;

export function EmailPasswordSignInForm({ ...props }: EmailPasswordRegistrationFormProps) {
   const t = useTranslations();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const router = useRouter();
   const searchParams = useSearchParams();

   const defaultValues: DefaultValues<SellerProfileFormData> = {
      username: "",
      password: "",
   };

   const form = useForm<SellerProfileFormData>({
      resolver: zodResolver(emailPasswordRegistrationFormSchema),
      defaultValues,
   });

   const canProceed = form.formState.isValid;

   async function onSubmit(data: SellerProfileFormData) {
      if (!canProceed) return;
      setIsSubmitting(true);

      const result = await signIn("email-password", {
         username: data.username,
         password: data.password,
         redirect: false,
      });

      if (result?.error) {
         const errorMessage = result.code ?? "";
         form.setError("root", { message: errorMessage });
         setIsSubmitting(false);
         return;
      }

      const searchCallbackUrl = searchParams.get("callbackUrl");
      const callbackHref = getValidHref(searchCallbackUrl) ?? "/";
      router.push(callbackHref);
      location.reload();
   }

   return (
      <Form {...form}>
         <form
            {...props}
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-full w-full max-w-lg flex-1 flex-col gap-4"
         >
            <div className="space-y-4">
               <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>{t("auth.Email")}</FormLabel>
                        <FormControl>
                           <Input {...field} inputMode="email" />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>{t("auth.Password")}</FormLabel>
                        <FormControl>
                           <PasswordInput {...field} />
                        </FormControl>
                        <FormDescription>{t("auth.password-description")}</FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            {isSubmitting && <ButtonLoading size="lg" className="mt-4 w-full" />}
            {!isSubmitting && (
               <Button type="submit" size="lg" disabled={!canProceed} className="mt-4 w-full">
                  {t("auth.Sign In")}
               </Button>
            )}

            <FormRootError />
         </form>
      </Form>
   );
}
