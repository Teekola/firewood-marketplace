"use client";

import { ComponentProps, PropsWithChildren, useId } from "react";

import { CheckIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { useIsHydrated, useLastUnlockedStep } from "../store/request-offers-store-provider";
import { stepToPath } from "./use-step-manager";

const stepToProgressWidth: Record<number, string> = {
   1: "8%",
   2: "38%",
   3: "65%",
   4: "100%",
};

export function RequestOffersStepper() {
   const t = useTranslations("request-offers");
   const lastUnlockedStep = useLastUnlockedStep();
   const isHydrated = useIsHydrated();

   return (
      <nav className={cn("relative", !isHydrated && "animate-pulse")}>
         <ol className="mx-auto flex w-[95%] justify-between gap-4">
            <StepLink step={1} label={t("Firewood")} />
            <StepLink step={2} label={t("Delivery")} />
            <StepLink step={3} label={t("Contact")} />
            <StepLink step={4} label={t("Submit")} />
         </ol>
         <div className={cn("absolute left-[2.5%] top-[18px] -z-10 h-1 w-[95%] bg-muted")}>
            <div
               className="h-full w-10 bg-primary transition-all duration-500"
               style={{ width: stepToProgressWidth[lastUnlockedStep ?? 1] }}
            ></div>
         </div>
      </nav>
   );
}

function StepLink({
   step,
   label,
}: Readonly<{
   step: keyof typeof stepToPath;
   label: string;
}>) {
   const id = useId();
   const pathname = usePathname();
   const lastUnlockedStep = useLastUnlockedStep();
   const isHydrated = useIsHydrated();
   const isLoading = !isHydrated || lastUnlockedStep === undefined;
   const isDisabled = isLoading || lastUnlockedStep < step;
   const isCompleted = lastUnlockedStep && lastUnlockedStep > step;
   const href = stepToPath[step];
   const isActive = pathname === href;
   return (
      <li className={"mb-2 flex flex-col items-center gap-1 pb-5"}>
         <DisableAbleLink
            href={href}
            id={id}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            {...(isActive && { "aria-current": "step" })}
         >
            <div
               className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-4 border-primary bg-primary text-lg font-bold text-primary-foreground",
                  isActive && "bg-primary-foreground text-primary",
                  isDisabled && "border-muted bg-muted text-muted-foreground"
               )}
            >
               {!isCompleted && !isLoading && step}
               {isCompleted && <CheckIcon className="h-6 w-6" />}
            </div>
         </DisableAbleLink>
         <label
            htmlFor={id}
            className={cn(
               "absolute bottom-2 text-xs font-medium text-foreground",
               isDisabled && "text-muted-foreground"
            )}
         >
            {label}
         </label>
      </li>
   );
}

interface DisableAbleLinkProps extends ComponentProps<typeof Link> {
   disabled?: boolean;
}

function DisableAbleLink({
   disabled = false,
   children,
   ...props
}: Readonly<PropsWithChildren<DisableAbleLinkProps>>) {
   if (disabled) {
      return <>{children}</>;
   }

   return <Link {...props}>{children}</Link>;
}
