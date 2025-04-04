"use client";

import { useTranslations } from "next-intl";
import { FieldValues, Path, useFormContext } from "react-hook-form";

import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/user-store";
import { kilometersToMiles } from "@/lib/utils/unit-conversions";

export const distanceOptionsKm = new Array(30).fill(1).map((v, i) => (i + 1) * 25);
export const distanceOptionsMi = distanceOptionsKm.map((km) => Math.round(kilometersToMiles(km)));

export function MaxDistanceSelectField<T extends FieldValues>({
   name,
}: Readonly<{ name: Path<T> }>) {
   const form = useFormContext<T>();
   const t = useTranslations("dashboard");
   const user = useUser();
   const isMetric = user.preferredUnitSystem === "METRIC";
   const unit = isMetric ? "km" : "mi";
   const distanceOptions = isMetric ? distanceOptionsKm : distanceOptionsMi;

   return (
      <FormField
         control={form.control}
         name={name}
         render={({ field }) => (
            <FormItem>
               <FormLabel>{t("Max distance")}</FormLabel>
               <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                     <SelectTrigger className="max-w-36">
                        <SelectValue />
                     </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[min(50vh,320px)] min-h-16">
                     {distanceOptions.map((distance) => (
                        <SelectItem key={distance} value={distance + ""}>
                           {distance} {unit}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
               <FormDescription>
                  {t(
                     "Set the rough maximum distance for quotation requests The larger the distance the more quotation requests you will receive We recommend setting this rather too high than too low The location is determined based on postal codes so this is not very accurate"
                  )}
               </FormDescription>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}
