import { ChangeEvent } from "react";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ContactData } from "./contact-form";

export function PhoneField() {
   const form = useFormContext<ContactData>();
   const t = useTranslations("request-offers");
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
      const shouldValidate = form.formState.errors["phone"]
         ? (masked.length >= 6 && masked.length <= 15) || masked.length < 1
         : masked.length === 0 || masked.length > 15;

      form.setValue("phone", masked, { shouldValidate, shouldDirty: true, shouldTouch: true });
   };

   return (
      <FormField
         name="phone"
         control={form.control}
         render={({ field }) => (
            <FormItem className="w-full">
               <FormLabel>{t("Phone")}</FormLabel>
               <FormControl>
                  <Input
                     {...field}
                     onChange={handlePhoneChange}
                     placeholder={t("Type your phone number")}
                  />
               </FormControl>
               <FormDescription>{t("You may use any format")}</FormDescription>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
