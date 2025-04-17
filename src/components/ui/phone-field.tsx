import { ChangeEvent } from "react";

import { useTranslations } from "next-intl";
import { FieldPath, FieldValues, useFormContext } from "react-hook-form";

import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface PhoneFieldProps<T extends FieldValues = any>
   extends React.HTMLAttributes<HTMLDivElement> {
   name: FieldPath<T>;
   label: string;
   disabled?: boolean;
}

export function PhoneField({ name, label, disabled, ...props }: PhoneFieldProps) {
   const form = useFormContext();
   const t = useTranslations();
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
      const shouldValidate = form.formState.errors.phone
         ? (masked.length >= 6 && masked.length <= 15) || masked.length < 1
         : form.formState.isValid || masked.length > 6 || masked.length > 15 || masked.length === 0;

      form.setValue(name, masked, { shouldValidate, shouldDirty: true, shouldTouch: true });
   };

   return (
      <FormField
         name={name}
         control={form.control}
         render={({ field }) => (
            <FormItem {...props} className={cn("w-full", props.className)}>
               <FormLabel>{label}</FormLabel>
               <FormControl>
                  <Input
                     {...field}
                     disabled={disabled}
                     onChange={handlePhoneChange}
                     placeholder={t("form-placeholders.phone")}
                  />
               </FormControl>
               <FormDescription>{t("form-descriptions.You may use any format")}</FormDescription>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
