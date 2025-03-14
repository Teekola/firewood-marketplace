"use client";

import { ComponentProps } from "react";

import { ArrowUpDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SortOrder } from "@/lib/utils/types";

interface SortButtonProps extends ComponentProps<typeof SelectTrigger> {
   sortOrder: SortOrder;
   setSortOrder: (o: SortOrder) => void;
}

export function SortButton({ sortOrder, setSortOrder, ...props }: Readonly<SortButtonProps>) {
   const t = useTranslations();
   return (
      <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
         <SelectTrigger
            {...props}
            className={cn("m-1 ml-auto max-w-32", props.className)}
            icon={<ArrowUpDownIcon className="h-4 w-4 opacity-50" />}
         >
            <SelectValue asChild>
               <p>{t(`sorting.${sortOrder}`)}</p>
            </SelectValue>
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="newest-first">{t("sorting.newest-first")}</SelectItem>
            <SelectItem value="oldest-first">{t("sorting.oldest-first")}</SelectItem>
         </SelectContent>
      </Select>
   );
}
