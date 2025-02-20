"use client";

import { ComponentProps } from "react";

import { UnitSystem } from "@prisma/client";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useUser } from "@/components/auth/user-store-provider";
import { Link, Pathname, StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
   imperialWoodAmountUnit,
   imperialWoodLengthUnit,
   metricWoodAmountUnit,
   metricWoodLengthUnit,
} from "@/lib/utils/units";

import {
   useContactData,
   useDeliveryData,
   useFirewoodData,
} from "../../(store)/request-offers-store-provider";

export function Preview({ ...props }: Readonly<ComponentProps<"div">>) {
   const firewoodData = useFirewoodData();
   const deliveryData = useDeliveryData();
   const contactData = useContactData();
   const t = useTranslations("request-offers");

   const isImperial = useUser().preferredUnitSystem === UnitSystem.IMPERIAL;
   const amountUnit = isImperial ? imperialWoodAmountUnit : metricWoodAmountUnit;
   const lengthUnit = isImperial ? imperialWoodLengthUnit : metricWoodLengthUnit;

   return (
      <div
         {...props}
         className={cn("flex flex-col gap-4 text-sm", props.className && props.className)}
      >
         <section>
            <PreviewTitle title={t("Firewood")} href="/request-offers/firewood" />
            {firewoodData && (
               <p className="mt-1">
                  <span className="relative pr-3">
                     {firewoodData.amount} {amountUnit}
                     <span className="-translate-y-1/5 absolute text-xs">{"3"}</span>
                  </span>
                  {firewoodData.dryness === "any" ? t("dry or green") : t(firewoodData.dryness)}{" "}
                  {t(firewoodData.woodType)}
                  {firewoodData.maxLength && `, ${firewoodData.maxLength} ${lengthUnit}`}
               </p>
            )}
         </section>
         <section className="flex flex-col gap-1">
            <PreviewTitle title={t("Delivery")} href="/request-offers/delivery" />
            {deliveryData && (
               <>
                  <p className="capitalize">{t(deliveryData.deliveryMethod)}</p>
                  <p>
                     {deliveryData.address} {deliveryData.postalCode}{" "}
                     <span className="capitalize">{deliveryData.city?.toLowerCase()}</span>{" "}
                     {deliveryData.countryName}
                  </p>
               </>
            )}
         </section>
         <section className="flex flex-col gap-1">
            <PreviewTitle title={t("Contact")} href="/request-offers/contact" />
            {contactData && (
               <>
                  <p>{contactData.name}</p>
                  <p>{contactData.email}</p>
                  <p>{contactData.phone}</p>
                  {contactData.isCompany && <p>{contactData.companyName}</p>}
               </>
            )}
         </section>
      </div>
   );
}

function PreviewTitle({ href, title }: Readonly<{ href: Pathname; title: string }>) {
   return (
      <p className="inline-flex items-center gap-2 text-sm font-bold">
         {title}{" "}
         <Link href={href as StaticPathname}>
            <EditIcon className="h-[18px] w-[18px] cursor-pointer" />
         </Link>
      </p>
   );
}
