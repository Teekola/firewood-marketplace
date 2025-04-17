import { getOfferById } from "@/db/offer";
import { authWithSeller } from "@/lib/auth/auth";

import { OfferEditDialog } from "../../../(tabs)/(active)/_components/offer-edit-dialog";

export default async function OfferEditPage({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const [offer, auth] = await Promise.all([
      params.then(({ id }) => getOfferById(id)),
      authWithSeller(),
   ]);

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
