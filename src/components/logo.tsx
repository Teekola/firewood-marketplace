import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Logo({ ...props }: Readonly<ComponentProps<"div">>) {
   return (
      <div
         {...props}
         className={cn(
            "text-secondary-foreground-foreground text-2xl font-extrabold",
            props.className && props.className
         )}
      >
         {"Polttopuutori"}
      </div>
   );
}
