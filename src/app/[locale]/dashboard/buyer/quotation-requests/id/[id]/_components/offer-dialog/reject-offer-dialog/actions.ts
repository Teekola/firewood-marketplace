"use server";

import { rejectOfferById } from "@/db/offer";

export async function rejectOffer({
   offerId,
   quotationRequestId,
   isAcceptedOffer,
}: {
   offerId: string;
   quotationRequestId: string;
   isAcceptedOffer: boolean;
}) {
   await rejectOfferById({ offerId, quotationRequestId, isAcceptedOffer });
}
