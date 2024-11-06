"use client";

import { ComponentProps } from "react";

import { Link } from "@/i18n/routing";

// import { useLastUnlockedStep } from "../store/request-offers-store-provider";

const basePath = "/request-offers";
export const stepToPath: Record<number, ComponentProps<typeof Link>["href"]> = {
   1: `${basePath}/firewood`,
   2: `${basePath}/delivery`,
   3: `${basePath}/contact`,
   4: `${basePath}/submit`,
};

export function StepManager() {
   // const lastUnlockedStep = useLastUnlockedStep();
   return null;
}
