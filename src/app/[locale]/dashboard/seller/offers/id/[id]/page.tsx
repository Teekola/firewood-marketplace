import { getOfferById } from "@/app/db/offer";

import OfferDialog from "../../(components)/offer-dialog";

export default async function OfferPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;
   const offer = await getOfferById(id);
   return <OfferDialog offer={offer} isOpen={true} />;
}
