"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UnitSystem } from "@prisma/client";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { useUser } from "@/components/auth/user-store-provider";
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
import { RadioGroup } from "@/components/ui/radio-group";

import { RadioGroupItemCard } from "../request-offers/(components)/radio-group-item-card";
import { saveUserPreferences } from "./saveUserPreferences";

export const newUserFormSchema = z.object({
   registerAsSeller: z.boolean(),
   unitSystem: z.nativeEnum(UnitSystem),
});
export type NewUserFormData = z.infer<typeof newUserFormSchema>;

export function NewUserForm() {
   const user = useUser();

   const defaultValues: DefaultValues<NewUserFormData> = {
      registerAsSeller: false,
      unitSystem: "METRIC",
   };

   const form = useForm<NewUserFormData>({
      resolver: zodResolver(newUserFormSchema),
      defaultValues,
   });

   const t = useTranslations("new-user-page");

   async function onSubmit(data: NewUserFormData) {
      console.log("You submitted the following values", data);

      // Call server action to update user data!
      await saveUserPreferences({ userId: user.id, ...data });
   }

   const canProceed = form.formState.isValid;

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex h-full max-w-lg flex-1 flex-col justify-between gap-4"
         >
            <div className="space-y-4">
               <FormField
                  control={form.control}
                  name="unitSystem"
                  render={({ field }) => (
                     <FormItem className="space-y-1">
                        <FormLabel>{t("Unit system")}</FormLabel>
                        <RadioGroup
                           onValueChange={field.onChange}
                           value={field.value}
                           className="grid grid-cols-3 gap-4 focus-within:[&:has(:focus-visible)]:ring-2 focus-within:[&:has(:focus-visible)]:ring-ring focus-within:[&:has(:focus-visible)]:ring-offset-4"
                        >
                           <RadioGroupItemCard value="METRIC" label={t("Metric")} />
                           <RadioGroupItemCard value="IMPERIAL" label={t("Imperial")} />
                        </RadioGroup>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <FormField
               control={form.control}
               name="registerAsSeller"
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
                        {t("Register as a seller")}
                     </FormLabel>
                  </FormItem>
               )}
            />

            <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
               {t("Confirm choices")}
            </Button>
         </form>
      </Form>
   );
}
