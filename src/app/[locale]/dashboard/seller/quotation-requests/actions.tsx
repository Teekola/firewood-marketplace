"use server";

import { SellerQuotationRequestStatus } from "@prisma/client";

import { type CreateOfferArgs, createOffer as createOfferDB } from "@/app/db/offer";
import {
   getPendingQuotationRequestsBySellerIdPaginated,
   getPendingQuotationRequestsCountBySellerId,
   getRejectedQuotationRequestCountBySellerId,
   getRejectedQuotationRequestsBySellerIdPaginated,
   updateSellerQuotationRequestStatus,
} from "@/app/db/quotation-request";
import { authWithSeller, getAuthorizedSeller } from "@/auth/auth";
import { SortOrder } from "@/lib/utils/types";

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
      return { requests: [], nextCursor: null, count: 0 };
   }

   const [results, count] = await Promise.all([
      getPendingQuotationRequestsBySellerIdPaginated({
         sellerId: session.seller.id,
         cursor,
         limit,
         sort,
      }),
      getPendingQuotationRequestsCountBySellerId({ sellerId: session.seller.id }),
   ]);

   const hasMore = results.length > limit;
   const requests = hasMore ? results.slice(0, limit) : results;
   const nextCursor = hasMore ? requests[requests.length - 1].id : null;

   return { requests, nextCursor, count };
}

export async function getRejectedQuotationRequestsForSeller({
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
      return { requests: [], nextCursor: null, count: 0 };
   }

   const [results, count] = await Promise.all([
      getRejectedQuotationRequestsBySellerIdPaginated({
         sellerId: session.seller.id,
         cursor,
         limit,
         sort,
      }),
      getRejectedQuotationRequestCountBySellerId({ sellerId: session.seller.id }),
   ]);

   const hasMore = results.length > limit;
   const requests = hasMore ? results.slice(0, limit) : results;
   const nextCursor = hasMore ? requests[requests.length - 1].id : null;

   return { requests, nextCursor, count };
}

export async function rejectQuotationRequest(quotationRequestId: string) {
   const { seller } = await getAuthorizedSeller();
   return await updateSellerQuotationRequestStatus({
      sellerId: seller.id,
      quotationRequestId,
      status: SellerQuotationRequestStatus.REJECTED,
   });
}

export async function restoreQuotationRequest(quotationRequestId: string) {
   const { seller } = await getAuthorizedSeller();
   return await updateSellerQuotationRequestStatus({
      sellerId: seller.id,
      quotationRequestId,
      status: SellerQuotationRequestStatus.PENDING,
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
