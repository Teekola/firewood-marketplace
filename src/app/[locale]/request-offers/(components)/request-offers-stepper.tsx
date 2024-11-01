"use client";

import { ComponentProps, PropsWithChildren, useEffect, useId } from "react";

import { useTranslations } from "next-intl";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { useLastUnlockedStep } from "../store/request-offers-store-provider";

const stepToProgressWidth = {
   1: "40px",
   2: "180px",
   3: "322px",
   4: "100%",
};

const pathnameToStep = {
   "/request-offers/firewood": 1,
   "/request-offers/delivery": 2,
   "/request-offers/contact": 3,
   "/request-offers/submit": 4,
};

export function RequestOffersStepper() {
   const t = useTranslations("request-offers");
   const lastUnlockedStep = useLastUnlockedStep();
   const pathname = usePathname();
   const router = useRouter();

   const isAllowedPage =
      pathname in pathnameToStep &&
      pathnameToStep[pathname as keyof typeof pathnameToStep] <= lastUnlockedStep;

   useEffect(() => {
      if (isAllowedPage) return;

      const lastUnlockedRoute = Object.entries(pathnameToStep).find(
         ([, step]) => step === lastUnlockedStep
      )![0];
      router.push(lastUnlockedRoute as keyof typeof pathnameToStep);
   }, [isAllowedPage, router, lastUnlockedStep]);

   return (
      <nav className="relative">
         <ol className="mx-auto flex w-[95%] justify-between gap-4">
            <StepLink href="/request-offers/firewood" number={1} label={t("Firewood")} />
            <StepLink
               href="/request-offers/delivery"
               disabled={lastUnlockedStep < 2}
               number={2}
               label={t("Delivery")}
            />
            <StepLink
               href="/request-offers/contact"
               disabled={lastUnlockedStep < 3}
               number={3}
               label={t("Contact")}
            />
            <StepLink
               href="/request-offers/submit"
               disabled={lastUnlockedStep < 4}
               number={4}
               label={t("Submit")}
            />
         </ol>
         <div className="absolute left-[2.5%] top-[18px] -z-10 h-1 w-[95%] bg-muted">
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
}: Readonly<{
   href: ComponentProps<typeof Link>["href"];
   number: number;
   label: string;
   disabled?: boolean;
}>) {
   const id = useId();
   const pathname = usePathname();
   const isActive = pathname === href;
   return (
      <li className="mb-2 flex flex-col items-center gap-1 pb-5">
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
               {number}
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
