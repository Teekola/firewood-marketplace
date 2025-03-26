"use server";

import { acceptOfferById } from "@/app/db/offer";

export async function acceptOffer({
   offerId,
   quotationRequestId,
}: {
   offerId: string;
   quotationRequestId: string;
}) {
   await acceptOfferById({ offerId, quotationRequestId });
}
