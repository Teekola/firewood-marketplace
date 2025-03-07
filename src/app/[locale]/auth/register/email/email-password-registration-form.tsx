"use client";

import { ComponentProps, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Link } from "@/i18n/routing";
import { AuthError, parseError } from "@/lib/utils/errors";
import "@/lib/utils/unit-conversions";

import { registerWithEmailAndPassword } from "../actions";

export const emailPasswordRegistrationFormSchema = z.object({
   username: z.string().min(1, "Email is required").email("The email is invalid"),
   password: z.string().min(8, "The password is too short"),
   hasAcceptedTerms: z
      .boolean()
      .optional()
      .refine((v) => v === true, {
         message: "You must agree to our terms and conditions to register",
      }),
});

export type SellerProfileFormData = z.infer<typeof emailPasswordRegistrationFormSchema>;

type EmailPasswordRegistrationFormProps = ComponentProps<"form">;

export function EmailPasswordRegistrationForm({ ...props }: EmailPasswordRegistrationFormProps) {
   const t = useTranslations();
   const [isSubmitting, setIsSubmitting] = useState(false);

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
      try {
         form.reset(data);
         const result = await registerWithEmailAndPassword(data);
         if ("error" in result) {
            throw new AuthError({ message: result.error as string, code: 400, name: "AUTH_ERROR" });
         }
         // TODO: Implement more secure verification flow for email!
         await signIn("email-password", data);
      } catch (error) {
         setIsSubmitting(false);
         const errorData = parseError(error);
         console.log(errorData);
         form.setError("root", {
            type: "registerUserWithEmailAndPasswordError",
            message: errorData.message,
         });
      }
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
            <FormField
               control={form.control}
               name="hasAcceptedTerms"
               render={({ field }) => (
                  <FormItem>
                     <div className="flex gap-2">
                        <FormControl>
                           <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>

                        <FormDescription className="-mt-1">
                           {t("terms.By registering I conrifm that I accept")}{" "}
                           <Link href="/" className="underline">
                              {t("terms.Terms and Conditions")}
                           </Link>{" "}
                           {t("terms.and that I have read")}{" "}
                           <Link href="/" className="underline">
                              {t("terms.Privacy Policy")}
                           </Link>
                           {"."}
                        </FormDescription>
                     </div>
                     <FormMessage />
                  </FormItem>
               )}
            />

            {isSubmitting && <ButtonLoading size="lg" className="mt-4 w-full" />}
            {!isSubmitting && (
               <Button type="submit" size="lg" data-disabled={!canProceed} className="mt-4 w-full">
                  {t("auth.Sign up")}
               </Button>
            )}

            <FormRootError />
         </form>
      </Form>
   );
}
