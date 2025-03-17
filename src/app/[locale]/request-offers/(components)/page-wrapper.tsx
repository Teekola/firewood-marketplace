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
         <div className="flex h-full max-h-[700px] flex-col justify-between space-y-3 xs:max-h-[640px]">
            <Skeleton className="h-14 w-60" />
            <Skeleton className="h-full" />
            <div className="space-y-4">
               <Skeleton className="mt-6 h-10" />
               <Skeleton className="h-8 w-44" />
            </div>
         </div>
      );

   return <div className="flex h-full max-h-[700px] flex-col xs:max-h-[600px]">{children}</div>;
}
