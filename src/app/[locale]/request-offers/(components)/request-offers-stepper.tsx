"use client";

import { ComponentProps, PropsWithChildren, useId } from "react";

import { CheckIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { useIsHydrated, useLastUnlockedStep } from "../store/request-offers-store-provider";

const stepToProgressWidth = {
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
            <StepLink
               href="/request-offers/firewood"
               number={1}
               label={t("Firewood")}
               completed={lastUnlockedStep > 1}
               isLoading={!isHydrated}
            />
            <StepLink
               href="/request-offers/delivery"
               disabled={lastUnlockedStep < 2}
               completed={lastUnlockedStep > 2}
               number={2}
               label={t("Delivery")}
               isLoading={!isHydrated}
            />
            <StepLink
               href="/request-offers/contact"
               disabled={lastUnlockedStep < 3}
               completed={lastUnlockedStep > 3}
               number={3}
               label={t("Contact")}
               isLoading={!isHydrated}
            />
            <StepLink
               href="/request-offers/submit"
               disabled={lastUnlockedStep < 4}
               completed={lastUnlockedStep > 4}
               number={4}
               label={t("Submit")}
               isLoading={!isHydrated}
            />
         </ol>
         <div className={cn("absolute left-[2.5%] top-[18px] -z-10 h-1 w-[95%] bg-muted")}>
            <div
               className="h-full w-10 bg-primary transition-all duration-500"
               style={{ width: stepToProgressWidth[lastUnlockedStep] }}
            ></div>
         </div>
      </nav>
   );
}

function StepLink({
   href,
   number,
   label,
   disabled: isDisabled,
   completed,
   isLoading,
}: Readonly<{
   href: ComponentProps<typeof Link>["href"];
   number: number;
   label: string;
   disabled?: boolean;
   completed?: boolean;
   isLoading?: boolean;
}>) {
   const disabled = isLoading || isDisabled;
   const id = useId();
   const pathname = usePathname();
   const isActive = pathname === href;
   return (
      <li className={"mb-2 flex flex-col items-center gap-1 pb-5"}>
         <DisableAbleLink
            href={href}
            id={id}
            disabled={disabled}
            aria-disabled={disabled}
            {...(isActive && { "aria-current": "step" })}
         >
            <div
               className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-4 border-primary bg-primary text-lg font-bold text-primary-foreground",
                  isActive && "bg-primary-foreground text-primary",
                  disabled && "border-muted bg-muted text-muted-foreground"
               )}
            >
               {!completed && number}
               {completed && <CheckIcon className="h-6 w-6" />}
            </div>
         </DisableAbleLink>
         <label
            htmlFor={id}
            className={cn(
               "absolute bottom-2 text-xs font-medium text-foreground",
               disabled && "text-muted-foreground"
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
