import { getOfferById } from "@/app/db/offer";
import { authWithSeller } from "@/auth/auth";

import { OfferEditDialog } from "../../../../(tabs)/(active)/(components)/offer-edit-dialog";

export default async function OfferEditPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const [offer, auth] = await Promise.all([getOfferById(id), authWithSeller()]);

   if (!auth) return null;

   if (!auth.seller?.location?.countryCode) {
      // TODO: Display instructions to go fill in the country code before being able to do this
      // TODO: Might need to build a centralized approach and also take into account the paywall that will be added
      return null;
   }

   return (
      <OfferEditDialog isOpen={true} offer={offer} countryCode={auth.seller.location.countryCode} />
   );
}
