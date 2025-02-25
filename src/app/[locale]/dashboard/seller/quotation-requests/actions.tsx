"use server";

import { SellerQuotationRequestStatus } from "@prisma/client";

import {
   type CreateOfferArgs,
   createOffer as createOfferDB,
   getActiveOffersBySellerId,
} from "@/app/db/offer";
import {
   getPendingQuotationRequestsBySellerIdPaginated,
   updateSellerQuotationRequestStatus,
} from "@/app/db/quotation-request";
import { authWithSeller, getAuthorizedSeller } from "@/auth/auth";
import { SortOrder } from "@/lib/utils/types";

// TODO: need to implement pagination
export async function getPendingQuotationRequestsForSeller({
   cursor,
   limit = 10,
   sort = "newest-first",
}: {
   cursor: string | null;
   limit?: number;
   sort?: SortOrder;
}) {
   const session = await authWithSeller();
   if (!session || !session.seller) {
      return { requests: [], nextCursor: null };
   }

   const results = await getPendingQuotationRequestsBySellerIdPaginated({
      sellerId: session.seller.id,
      cursor,
      limit,
      sort,
   });

   const hasMore = results.length > limit;
   const requests = hasMore ? results.slice(0, limit) : results;
   const nextCursor = hasMore ? requests[requests.length - 1].id : null;

   return { requests, nextCursor };
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
