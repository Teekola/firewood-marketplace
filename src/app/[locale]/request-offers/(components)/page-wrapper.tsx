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
         <div className="h-[534px] min-h-[534px] space-y-4 xs:h-[450px] xs:min-h-[450px]">
            <Skeleton className="h-12" />
            <Skeleton className="h-96" />
            <Skeleton className="h-10" />
         </div>
      );

   return <div className="h-[534px] min-h-[534px] xs:h-[450px] xs:min-h-[450px]">{children}</div>;
}
