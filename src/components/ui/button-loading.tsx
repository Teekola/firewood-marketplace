import { ComponentProps } from "react";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ButtonLoading(props: ComponentProps<typeof Button>) {
   const t = useTranslations();
   return (
      <Button
         disabled
         {...props}
         className={cn("flex items-center justify-center gap-2", props.className)}
      >
         <Loader2 className="animate-spin" /> {t("instructions.Please wait")}
      </Button>
   );
}
