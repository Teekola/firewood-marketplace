import { ComponentProps, ReactNode } from "react";

import { Checkbox } from "@radix-ui/react-checkbox";

import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

interface CheckboxGroupItemCardProps extends ComponentProps<typeof FormItem> {
   label: string;
   icon?: ReactNode;
   checked: boolean;
   onChange: () => void;
}

export function CheckboxGroupItemCard({
   label,
   icon,
   checked,
   onChange,
   ...props
}: CheckboxGroupItemCardProps) {
   return (
      <FormItem
         {...props}
         className="rounded outline-none ring-offset-background [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-primary [&:has(:focus-visible)]:ring-offset-2"
      >
         <FormLabel className="[&:has([data-state=checked])>div]:border-secondary">
            <FormControl>
               <Checkbox checked={checked} onCheckedChange={onChange} className="sr-only" />
            </FormControl>
            <div className="flex h-28 cursor-pointer items-center justify-center rounded-md border-4 border-border p-1 capitalize hover:bg-background-hover">
               {icon}
               {label}
            </div>
         </FormLabel>
      </FormItem>
   );
}
