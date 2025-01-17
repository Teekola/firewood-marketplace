"use client";

import { PropsWithChildren } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { useIsStepVerified } from "../(store)/request-offers-store-provider";
import { useStepManager } from "./use-step-manager";

export function PageWrapper({ children }: PropsWithChildren) {
   const isStepVerified = useIsStepVerified();
   useStepManager();

   if (!isStepVerified)
      return (
         <div className="flex h-[640px] min-h-[640px] flex-col space-y-4 xs:h-[600px] xs:min-h-[600px]">
            <Skeleton className="h-12" />
            <Skeleton className="h-[470px] xs:h-[416px]" />
            <Skeleton className="h-11" />
         </div>
      );

   return (
      <div className="flex h-[660px] min-h-[660px] flex-col xs:h-[640px] xs:min-h-[640px]">
         {children}
      </div>
   );
}
