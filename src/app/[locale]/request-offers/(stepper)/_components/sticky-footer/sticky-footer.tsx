"use client";

import { ComponentProps, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

import { AbandonRequestDialog } from "./abandon-request-dialog";

type StickyFooterProps = PropsWithChildren<ComponentProps<"div">>;

export function StickyFooter({ children, ...props }: Readonly<StickyFooterProps>) {
   return (
      <div {...props} className={cn("sticky bottom-0", props.className && props.className)}>
         <div
            className="pointer-events-none h-8 w-full bg-gradient-to-b from-transparent via-background to-background"
            aria-hidden="true"
         ></div>
         <div className="flex gap-2 bg-background">{children}</div>
         <div className="flex h-16 bg-background">
            <AbandonRequestDialog className="my-auto self-start" />
         </div>
      </div>
   );
}
