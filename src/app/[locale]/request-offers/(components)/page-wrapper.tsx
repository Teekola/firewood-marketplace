"use client";

import { PropsWithChildren } from "react";

import { useIsStepVerified } from "../(store)/request-offers-store-provider";
import { useStepManager } from "./use-step-manager";

export function PageWrapper({ children }: PropsWithChildren) {
   const isStepVerified = useIsStepVerified();
   useStepManager();

   if (!isStepVerified)
      return (
         <div className="flex h-full max-h-[740px] min-h-[700px] flex-col space-y-4 xs:min-h-[640px]">
            {/**TODO: Make perfect skeleton */}
         </div>
      );

   return (
      <div className="flex h-full max-h-[740px] min-h-[700px] flex-col xs:min-h-[640px]">
         {children}
      </div>
   );
}
