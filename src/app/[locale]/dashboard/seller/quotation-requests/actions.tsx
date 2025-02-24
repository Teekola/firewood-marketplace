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
import { authWithSeller } from "@/auth/auth";

// TODO: need to implement pagination
export async function getPendingQuotationRequestsForSeller() {
   const session = await authWithSeller();
   if (!session || !session.seller) {
      return [];
   }
   return await getPendingQuotationRequestsBySellerId({ sellerId: session.seller.id });
}

export async function createOffer(data: Omit<CreateOfferArgs, "sellerId">) {
   const session = await authWithSeller();
   if (!session) {
      throw new Error("Unauthorized.");
   }

   if (!session.seller) {
      throw new Error("The user is not a seller.");
   }

   const [offer] = await Promise.all([
      createOfferDB({ ...data, sellerId: session.seller.id }),
      updateSellerQuotationRequestStatus({
         sellerId: session.seller.id,
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
