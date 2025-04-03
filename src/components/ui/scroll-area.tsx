"use client";

import * as React from "react";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
   React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
   <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative h-full overflow-hidden", className)}
      {...props}
   >
      <div className="absolute inset-0 h-full">
         <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
            <div
               className="pointer-events-none sticky top-0 z-10 h-5 w-full bg-gradient-to-b from-background to-transparent"
               aria-hidden="true"
            ></div>
            {children}
            <div
               className="pointer-events-none sticky bottom-0 h-5 w-full bg-gradient-to-b from-transparent to-background"
               aria-hidden="true"
            ></div>
         </ScrollAreaPrimitive.Viewport>
         <ScrollBar />
         <ScrollAreaPrimitive.Corner />
      </div>
   </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
   React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
   <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
         "z-20 flex touch-none select-none transition-colors",
         orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
         orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
         className
      )}
      {...props}
   >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
   </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
