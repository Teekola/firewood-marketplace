"use server";

import { SellerQuotationRequestStatus } from "@prisma/client";

import {
   type CreateOfferArgs,
   createOffer as createOfferDB,
   getActiveOffersBySellerId,
} from "@/app/db/offer";
import {
   getPendingQuotationRequestsBySellerId,
   updateSellerQuotationRequestStatus,
} from "@/app/db/quotation-request";
import { authWithSeller, getAuthorizedSeller } from "@/auth/auth";

// TODO: need to implement pagination
export async function getPendingQuotationRequestsForSeller() {
   const session = await authWithSeller();
   if (!session || !session.seller) {
      return [];
   }
   return await getPendingQuotationRequestsBySellerId({ sellerId: session.seller.id });
}

export async function rejectQuotationRequest(quotationRequestId: string) {
   const { seller } = await getAuthorizedSeller();
   return await updateSellerQuotationRequestStatus({
      sellerId: seller.id,
      quotationRequestId,
      status: SellerQuotationRequestStatus.REJECTED,
   });
}
export async function createOffer(data: Omit<CreateOfferArgs, "sellerId">) {
   const { seller } = await getAuthorizedSeller();

   const [offer] = await Promise.all([
      createOfferDB({ ...data, sellerId: seller.id }),
      updateSellerQuotationRequestStatus({
         sellerId: seller.id,
         quotationRequestId: data.quotationRequestId,
         status: SellerQuotationRequestStatus.OFFER_SENT,
      }),
   ]);

   return offer;
}

export async function getActiveOffersForSeller() {
   const session = await authWithSeller();
   if (!session || !session.seller) {
      return [];
   }
   return getActiveOffersBySellerId({ sellerId: session.seller.id });
}
