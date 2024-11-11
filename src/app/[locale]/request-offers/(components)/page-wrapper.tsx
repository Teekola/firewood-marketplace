"use client";

import { PropsWithChildren } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { useIsStepVerified } from "../store/request-offers-store-provider";
import { useStepManager } from "./use-step-manager";

export function PageWrapper({ children }: PropsWithChildren) {
   const isStepVerified = useIsStepVerified();
   useStepManager();

   if (!isStepVerified)
      return (
         <div className="flex h-[572px] min-h-[572px] flex-col space-y-4 xs:h-[512px] xs:min-h-[512px]">
            <Skeleton className="h-12" />
            <Skeleton className="h-[470px] xs:h-[416px]" />
            <Skeleton className="h-11" />
         </div>
      );

   return (
      <div className="flex h-[572px] min-h-[572px] flex-col xs:h-[512px] xs:min-h-[512px]">
         {children}
      </div>
   );
}
