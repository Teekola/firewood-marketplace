"use server";

import {
   UpdateOfferArgs,
   getActiveOffersBySellerIdPaginated,
   getActiveOffersCountBySellerId,
   updateOffer,
} from "@/app/db/offer";
import { authWithSeller } from "@/auth/auth";
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
