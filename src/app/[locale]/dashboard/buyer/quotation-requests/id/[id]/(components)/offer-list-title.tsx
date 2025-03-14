"use client";

import { ComponentProps } from "react";

import { useTranslations } from "next-intl";

import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type OfferListTitleProps = ComponentProps<"h2">;

export function OfferListTitle({ ...props }: Readonly<OfferListTitleProps>) {
   const pathname = usePathname();
   const isRejectedPage = pathname.includes("rejected-offers");
   if (isRejectedPage) {
      return <RejectedTitle {...props} />;
   }
   return <Title {...props} />;
}

function RejectedTitle({ ...props }: Readonly<OfferListTitleProps>) {
   const t = useTranslations();
   return (
      <h2 {...props} className={cn(props.className, "h4")}>
         {t("buyer.Rejected Offers")}
      </h2>
   );
}

function Title({ ...props }: Readonly<OfferListTitleProps>) {
   const t = useTranslations();

   return (
      <h2 {...props} className={cn(props.className, "h4")}>
         {t("buyer.Offers")}
      </h2>
   );
}
