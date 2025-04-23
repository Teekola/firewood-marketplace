"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { CheckboxGroupItemCard } from "@/components/ui/checkbox-group-item-card";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "@/i18n/routing";

import { registerUser } from "./actions";

const userIntention = {
   BUYING: "BUYING",
   SELLING: "SELLING",
} as const;

const userIntentions = Object.keys(userIntention) as (keyof typeof userIntention)[];

export const newUserFormSchema = z.object({
   userIntentions: z
      .array(z.nativeEnum(userIntention))
      .nonempty({ message: "Please select at least one option" }),
});

export type NewUserFormData = z.infer<typeof newUserFormSchema>;

export function NewUserForm({ userId }: Readonly<{ userId: string }>) {
   const defaultValues: DefaultValues<NewUserFormData> = {
      userIntentions: [],
   };

   const form = useForm<NewUserFormData>({
      resolver: zodResolver(newUserFormSchema),
      defaultValues,
   });

   const t = useTranslations();
   const router = useRouter();

   const canProceed = form.formState.isValid;

   async function onSubmit(data: NewUserFormData) {
      const result = await registerUser({
         userId,
         isSeller: data.userIntentions.includes(userIntention.SELLING),
      });
      console.log("Registered user", result.id);
      router.refresh();
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full max-w-lg flex-1 flex-col justify-between gap-4"
         >
            <FormField
               control={form.control}
               name="userIntentions"
               render={({ field }) => (
                  <FormItem className="mb-8 space-y-1">
                     <FormLabel>
                        {t("new-user.I intend to use the platform for")}
                        {"... "}
                     </FormLabel>
                     <div className="grid grid-cols-2 gap-2">
                        {userIntentions.map((userIntention) => (
                           <CheckboxGroupItemCard
                              key={userIntention}
                              label={t(`new-user.${userIntention}`)}
                              checked={field.value.includes(userIntention)}
                              onChange={() =>
                                 field.onChange(
                                    field.value.includes(userIntention)
                                       ? field.value.filter((v) => v !== userIntention) // Remove if it was checked
                                       : [...field.value, userIntention] // Add if it was not checked
                                 )
                              }
                           />
                        ))}
                     </div>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <DialogFooter>
               <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
                  {t("actions.Continue")}
               </Button>
            </DialogFooter>
         </form>
      </Form>
   );
}
