"use server";

import { SellerQuotationRequestStatus } from "@prisma/client";

import {
   UpdateOfferArgs,
   deleteOfferById,
   getActiveOffersBySellerIdPaginated,
   getActiveOffersCountBySellerId,
   updateOffer,
} from "@/app/db/offer";
import { updateSellerQuotationRequestStatus } from "@/app/db/quotation-request";
import { authWithSeller, getAuthorizedSeller } from "@/auth/auth";
import { SortOrder } from "@/lib/utils/types";

export async function getActiveOffersForSeller({
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
      return { offers: [], nextCursor: null, count: 0 };
   }
   const [results, count] = await Promise.all([
      getActiveOffersBySellerIdPaginated({
         sellerId: session.seller.id,
         cursor,
         limit,
         sort,
      }),
      getActiveOffersCountBySellerId({ sellerId: session.seller.id }),
   ]);

   const hasMore = results.length > limit;
   const offers = hasMore ? results.slice(0, limit) : results;
   const nextCursor = hasMore ? offers[offers.length - 1].id : null;

   return { offers, nextCursor, count };
}

export async function editOffer({ id, data }: UpdateOfferArgs) {
   const updateDate = new Date();
   const sellerLastSeenAt = new Date(updateDate.getTime() + 1000);
   await updateOffer({
      id,
      data: {
         ...data,
         rejectedAt: null,
         acceptedAt: null,
         sellerLastSeenAt,
         updatedAt: updateDate,
      },
   });
}

export async function deleteOffer({
   offerId,
   quotationRequestId,
}: {
   offerId: string;
   quotationRequestId: string;
}) {
   const { seller } = await getAuthorizedSeller();

   await updateSellerQuotationRequestStatus({
      quotationRequestId,
      status: SellerQuotationRequestStatus.PENDING,
      sellerId: seller.id,
   });
   await deleteOfferById(offerId);
}
