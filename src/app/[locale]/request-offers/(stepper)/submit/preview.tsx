"use client";

import { ComponentProps } from "react";

import { DeliveryMethod, UnitSystem } from "@prisma/client";
import { EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { FirewoodParagraph } from "@/components/quotation-request/firewood-details";
import { useGetTranslatedCountryName } from "@/components/ui/country-field";
import { useUser } from "@/hooks/user-store";
import {
   imperialWoodAmountUnit,
   imperialWoodLengthUnit,
   metricWoodAmountUnit,
   metricWoodLengthUnit,
} from "@/i18n/constants/units";
import { Link, Pathname, StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import {
   useContactData,
   useDeliveryData,
   useFirewoodData,
} from "../../(store)/request-offers-store-provider";

export function Preview({ ...props }: Readonly<ComponentProps<"div">>) {
   const firewoodData = useFirewoodData();
   const deliveryData = useDeliveryData();
   const contactData = useContactData();
   const t = useTranslations();
   const getTranslatedCountryName = useGetTranslatedCountryName();

   const isImperial = useUser().preferredUnitSystem === UnitSystem.IMPERIAL;
   const amountUnit = isImperial ? imperialWoodAmountUnit : metricWoodAmountUnit;
   const lengthUnit = isImperial ? imperialWoodLengthUnit : metricWoodLengthUnit;

   return (
      <div
         {...props}
         className={cn("flex flex-col gap-4 text-sm", props.className && props.className)}
      >
         <section>
            <PreviewTitle title={t("request-offers.Firewood")} href="/request-offers/firewood" />
            {firewoodData?.woodTypes && firewoodData.dryness && (
               <FirewoodParagraph
                  woodTypes={firewoodData.woodTypes}
                  woodDrynesses={firewoodData.dryness}
                  amount={firewoodData.amount ?? 0}
                  amountUnit={amountUnit}
                  lengthUnit={lengthUnit}
                  maxLength={firewoodData.maxLength}
               />
            )}
         </section>
         <section className="flex flex-col gap-1">
            <PreviewTitle title={t("request-offers.Delivery")} href="/request-offers/delivery" />
            {deliveryData && (
               <>
                  <p className="text-sm capitalize">
                     {deliveryData.deliveryMethods
                        ?.sort((a) => (a === DeliveryMethod.HOME_DELIVERY ? 1 : -1))
                        ?.map((method) => t(`delivery-methods.${method}`))
                        ?.join(", ")}
                  </p>
                  <p>
                     {deliveryData.address} {deliveryData.postalCode}{" "}
                     <span className="capitalize">{deliveryData.city?.toLowerCase()}</span>
                     {", "}
                     {getTranslatedCountryName(deliveryData.countryName)}
                  </p>
               </>
            )}
         </section>
         <section className="flex flex-col gap-1">
            <PreviewTitle title={t("request-offers.Contact")} href="/request-offers/contact" />
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
