import { getOfferById } from "@/db/offer";

import { OfferDialog } from "../../../(tabs)/(active)/(components)/offer-dialog";

export default async function OfferPageModal({
   params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const offer = await getOfferById(id);
   return <OfferDialog offer={offer} isOpen={true} />;
}
