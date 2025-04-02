import { getOfferById } from "@/db/offer";

import { OfferDialogRejected } from "../../../../(components)/offer-dialog-rejected";

export default async function OfferRejectedPage({
   params,
}: Readonly<{ params: Promise<{ id: string; offerId: string }> }>) {
   const { offerId } = await params;
   const offer = await getOfferById(offerId);
   return <OfferDialogRejected isOpen={true} offer={offer} />;
}
