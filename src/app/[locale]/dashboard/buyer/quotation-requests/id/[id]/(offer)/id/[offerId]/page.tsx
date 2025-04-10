import { getOfferById } from "@/db/offer";

import { OfferDialog } from "../../../_components/offer-dialog";

export default async function OfferPage({
   params,
}: Readonly<{ params: Promise<{ id: string; offerId: string }> }>) {
   const { offerId } = await params;
   const offer = await getOfferById(offerId);
   return <OfferDialog isOpen={true} offer={offer} />;
}
