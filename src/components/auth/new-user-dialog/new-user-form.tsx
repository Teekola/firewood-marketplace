"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
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
            className="flex h-full max-w-lg flex-1 flex-col justify-between gap-4"
         >
            <p>
               {t("I intend to use the platform for")}
               {"..."}
            </p>
            <div className="flex gap-2">
               <ToggleField name="isSeller" label={t("For selling")} />
               <ToggleField name="isBuyer" label={t("For buying")} />
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
               <FormLabel className="[&:has(:focus-visible)>div]:ring-2 [&:has(:focus-visible)>div]:ring-primary [&:has(:focus-visible)>div]:ring-offset-4 [&:has([data-state=checked])>div]:border-primary">
                  <FormControl>
                     <CheckboxPrimitive.Root
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        className="sr-only"
                     />
                  </FormControl>
                  <div className="flex h-28 w-full cursor-pointer items-center justify-center rounded-md border-4 border-muted bg-secondary p-1 capitalize hover:border-accent">
                     {label}
                  </div>
                  <FormMessage />
               </FormLabel>
            </FormItem>
         )}
      />
   );
}
