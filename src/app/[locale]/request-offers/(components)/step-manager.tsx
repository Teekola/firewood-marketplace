"use client";

import { PropsWithChildren, useEffect } from "react";

import { Pathname, usePathname, useRouter } from "@/i18n/routing";

import {
   useIsStepVerified,
   useLastUnlockedStep,
   useSetStepVerified,
} from "../store/request-offers-store-provider";

const basePath = "/request-offers";
export const stepToPath: Record<number, Pathname> = {
   1: `${basePath}/firewood`,
   2: `${basePath}/delivery`,
   3: `${basePath}/contact`,
   4: `${basePath}/submit`,
} as const;

const pathToStep: Record<Pathname, keyof typeof stepToPath> = Object.keys(stepToPath).reduce(
   (acc, step) => {
      const path = stepToPath[Number(step)];
      acc[path] = Number(step) as keyof typeof stepToPath;
      return acc;
   },
   {} as Record<Pathname, keyof typeof stepToPath>
);

export function StepManager({ children }: PropsWithChildren) {
   const lastUnlockedStep = useLastUnlockedStep();
   const pathname = usePathname();
   const router = useRouter();
   const setStepVerified = useSetStepVerified();
   const isStepVerified = useIsStepVerified();

   const currentStep = pathToStep[pathname];

   // Redirect to last unlocked step if in newer step
   useEffect(() => {
      if (currentStep <= lastUnlockedStep) {
         setStepVerified(true);
         return;
      }
      setStepVerified(false);
      router.push(stepToPath[lastUnlockedStep]);
   }, [currentStep, lastUnlockedStep, router, setStepVerified]);

   if (!isStepVerified) return null;

   return <>{children}</>;
}
