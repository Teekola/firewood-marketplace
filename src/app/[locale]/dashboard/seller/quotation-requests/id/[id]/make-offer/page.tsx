import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";

import { getQuotationRequest } from "@/app/db/quotation-request";
import { authWithSeller } from "@/auth/auth";

import { MakeOfferForm } from "../../../(components)/(make-offer-form)/make-offer-form";

export default async function MakeOfferPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const quotationRequest = await getQuotationRequest({ id });
   const t = await getTranslations();

   const auth = await authWithSeller();

   if (!auth) return null;

   if (!quotationRequest) return notFound();

   if (!auth.seller?.location?.countryCode) {
      // TODO: Handle this case correctly
      return null;
   }

   return (
      <div className="w-full space-y-3">
         <h3 className="text-2xl font-bold">{t("quotation-request.Make an Offer")}</h3>
         <MakeOfferForm countryCode={auth.seller.location.countryCode} />
      </div>
   );
}
