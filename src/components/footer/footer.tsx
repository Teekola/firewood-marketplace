import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { ThemeToggle } from "../theme-toggle";

export function Footer({ ...props }: Readonly<ComponentProps<"div">>) {
   return (
      <div
         {...props}
         className={cn(
            "mt-auto border-t border-border py-9 text-secondary-foreground",
            props.className
         )}
      >
         <div className="mx-auto flex max-w-screen-xl justify-end p-3">
            <ThemeToggle />
         </div>
      </div>
   );
}
