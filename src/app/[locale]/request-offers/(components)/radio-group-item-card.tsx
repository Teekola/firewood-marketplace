import { ComponentProps, ReactNode } from "react";

import { RadioGroupItem } from "@radix-ui/react-radio-group";

import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

interface RadioGroupItemCardProps extends ComponentProps<typeof FormItem> {
   value: string;
   label: string;
   icon?: ReactNode;
}
export function RadioGroupItemCard({ value, label, icon, ...props }: RadioGroupItemCardProps) {
   return (
      <FormItem {...props}>
         <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
            <FormControl>
               <RadioGroupItem value={value} className="sr-only" />
            </FormControl>
            <div className="flex h-28 cursor-pointer items-center justify-center rounded-md border-4 border-muted bg-secondary p-1 hover:border-accent">
               {icon}
               {label}
            </div>
         </FormLabel>
      </FormItem>
   );
}
