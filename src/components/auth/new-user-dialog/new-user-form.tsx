"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
// import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { useRouter } from "@/i18n/routing";

import { registerUser } from "./actions";

export const newUserFormSchema = z
   .object({
      isSeller: z.boolean(),
      isBuyer: z.boolean(),
   })
   .refine(
      (v) => {
         if (!v.isSeller && !v.isBuyer) {
            return false;
         }
         return true;
      },
      {
         message: "Please select at least one option",
         path: ["isBuyer"],
      }
   );

export type NewUserFormData = z.infer<typeof newUserFormSchema>;

export function NewUserForm({ userId }: Readonly<{ userId: string }>) {
   const defaultValues: DefaultValues<NewUserFormData> = {
      isBuyer: false,
      isSeller: false,
   };

   const form = useForm<NewUserFormData>({
      resolver: zodResolver(newUserFormSchema),
      defaultValues,
   });

   const t = useTranslations("new-user");
   const router = useRouter();

   const canProceed = form.formState.isValid;

   async function onSubmit(data: NewUserFormData) {
      const result = await registerUser({ userId, isSeller: data.isSeller });
      console.log("Registered user", result.id);

      if (data.isSeller) {
         router.push("/dashboard/seller");
         return;
      }

      router.push("/dashboard/buyer");
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full max-w-lg flex-1 flex-col justify-between gap-4"
         >
            <p>
               {t("I intend to use the platform for")}
               {"..."}
            </p>
            <div className="flex gap-2">
               <ToggleField name="isBuyer" label={t("For buying")} />
               <ToggleField name="isSeller" label={t("For selling")} />
            </div>

            <DialogFooter>
               <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
                  {t("Continue")}
               </Button>
            </DialogFooter>
         </form>
      </Form>
   );
}

function ToggleField({ name, label }: { name: keyof NewUserFormData; label: string }) {
   const form = useFormContext<NewUserFormData>();

   return (
      <FormField
         control={form.control}
         name={name}
         render={({ field }) => (
            <FormItem className="w-full space-y-1" {...field}>
               <FormLabel className="[&:has(:focus-visible)>div]:outline [&:has(:focus-visible)>div]:outline-offset-4 [&:has(:focus-visible)>div]:outline-primary [&:has([data-state=checked])>div]:border-primary">
                  <FormControl>
                     <CheckboxPrimitive.Root
                        checked={field.value}
                        onCheckedChange={(checked) => {
                           field.onChange(checked);
                           form.clearErrors();
                        }}
                        className="sr-only"
                     />
                  </FormControl>
                  <div className="flex h-28 w-full cursor-pointer items-center justify-center rounded-md border-4 border-muted bg-secondary p-1 capitalize hover:border-accent">
                     {label}
                  </div>
                  <FormMessage className="mt-2" />
               </FormLabel>
            </FormItem>
         )}
      />
   );
}
