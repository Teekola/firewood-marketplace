"use client";

import { ComponentProps } from "react";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonLoadingProps extends ComponentProps<typeof Button> {
   label?: string;
}

export function ButtonLoading({ label, ...props }: ButtonLoadingProps) {
   const t = useTranslations();
   const displayLabel = label ?? t("instructions.Please wait");

   return (
      <Button
         disabled
         {...props}
         className={cn("flex items-center justify-center gap-2", props.className)}
      >
         <Loader2 className="animate-spin" /> {displayLabel}
      </Button>
   );
}
