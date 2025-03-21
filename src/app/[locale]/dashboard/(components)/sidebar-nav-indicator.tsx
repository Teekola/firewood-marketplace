import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface SidebarNavIndicatorProps extends ComponentProps<"div"> {
   number?: number;
   icon?: React.ReactNode;
}

export function SidebarNavIndicator({ number, ...props }: SidebarNavIndicatorProps) {
   return (
      <div
         {...props}
         className={cn(
            "absolute right-4 flex h-5 items-center justify-center rounded-full bg-destructive px-[6px] text-xs font-bold text-destructive-foreground",
            props.className
         )}
      >
         {number ? number : ""}
      </div>
   );
}
