"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export const newUserFormSchema = z.object({
   isSeller: z.boolean(),
   isBuyer: z.boolean(),
});
export type NewUserFormData = z.infer<typeof newUserFormSchema>;

export function NewUserForm() {
   const defaultValues: DefaultValues<NewUserFormData> = {
      isSeller: false,
      isBuyer: false,
   };

   const form = useForm<NewUserFormData>({
      resolver: zodResolver(newUserFormSchema),
      defaultValues,
   });

   const t = useTranslations("new-user");

   const canProceed = form.formState.isValid;

   function onSubmit(data: NewUserFormData) {
      console.log(data);
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-full max-w-lg flex-1 flex-col justify-between gap-4"
         >
            <FormLabel>
               {t("I intend to")}
               {"..."}
            </FormLabel>
            <div className="flex gap-2">
               <FormField
                  control={form.control}
                  name="isSeller"
                  render={({ field }) => (
                     <FormItem className="w-full space-y-1" {...field}>
                        <div className="flex h-28 w-full cursor-pointer items-center justify-center rounded-md border-4 border-muted bg-secondary p-1 capitalize hover:border-accent"></div>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="isSeller"
                  render={({ field }) => (
                     <FormItem className="w-full space-y-1" {...field}>
                        <div className="flex h-28 cursor-pointer items-center justify-center rounded-md border-4 border-muted bg-secondary p-1 capitalize hover:border-accent"></div>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
               {t("Continue")}
            </Button>
         </form>
      </Form>
   );
}
