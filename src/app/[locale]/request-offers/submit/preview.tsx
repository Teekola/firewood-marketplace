"use client";

import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, Pathname } from "@/i18n/routing";

import {
   useContactData,
   useDeliveryData,
   useFirewoodData,
} from "../(store)/request-offers-store-provider";

export function Preview() {
   const firewoodData = useFirewoodData();
   const deliveryData = useDeliveryData();
   const contactData = useContactData();
   const t = useTranslations("request-offers");

   return (
      <div className="flex flex-col gap-4 text-sm">
         <section>
            <PreviewTitle title={t("Firewood")} href="/request-offers/firewood" />
            {firewoodData && (
               <p className="mt-1">
                  <span className="relative pr-3">
                     {firewoodData.amount} {"m"}
                     <span className="-translate-y-1/5 absolute text-xs">{"3"}</span>
                  </span>
                  {firewoodData.dryness === "any" ? t("dry or green") : t(firewoodData.dryness)}{" "}
                  {t(firewoodData.woodType)}
                  {firewoodData.maxLength && `, ${firewoodData.maxLength} cm`}
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
         <Link href={href}>
            <EditIcon className="h-[18px] w-[18px] cursor-pointer" />
         </Link>
      </p>
   );
}
