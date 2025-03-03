import { Currency, Prisma } from "@prisma/client";

import { SortOrder } from "@/lib/utils/types";
import { prisma } from "@/prisma";

const offerDTOFields = Prisma.validator<Prisma.OfferSelect>()({
   id: true,
   quotationRequestId: true,
   quotationRequest: true,
   sellerId: true,
   price: true,
   currency: true,
   earliestAvailability: true,
   createdAt: true,
   updatedAt: true,
   buyerLastSeenAt: true,
   sellerLastSeenAt: true,
   acceptedAt: true,
   rejectedAt: true,
});

export type OfferDTO = Prisma.OfferGetPayload<{
   select: typeof offerDTOFields;
}>;

export interface CreateOfferArgs {
   quotationRequestId: string;
   sellerId: string;
   price: string;
   currency: Currency;
   earliestAvailability: Date;
}

export const createOffer = async ({
   quotationRequestId,
   sellerId,
   price,
   currency,
   earliestAvailability,
}: CreateOfferArgs) => {
   const offer = await prisma.offer.create({
      data: {
         quotationRequest: {
            connect: { id: quotationRequestId },
         },
         seller: {
            connect: { id: sellerId },
         },
         price,
         currency,
         earliestAvailability,
      },
      select: offerDTOFields,
   });
   return offer;
};

export const getActiveOffersBySellerIdPaginated = async ({
   sellerId,
   cursor,
   limit,
   sort = "newest-first",
}: {
   sellerId: string;
   cursor: string | null;
   limit: number;
   sort?: SortOrder;
}) => {
   const offers = await prisma.offer.findMany({
      where: { sellerId, acceptedAt: null },
      select: offerDTOFields,
      take: limit + 1, // take 1 extra to check if there is more data and use as cursor
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: sort === "newest-first" ? "desc" : "asc" },
   });
   return offers;
};

export const getActiveOffersCountBySellerId = async ({ sellerId }: { sellerId: string }) => {
   const count = await prisma.offer.count({
      where: { sellerId, acceptedAt: null },
   });
   return count;
};

export const getOfferById = async (id: string) => {
   const offer = await prisma.offer.findUnique({ where: { id }, select: offerDTOFields });
   return offer;
};

export interface UpdateOfferArgs {
   id: string;
   data: Prisma.OfferUpdateInput;
}

export const updateOffer = async ({ id, data }: UpdateOfferArgs) => {
   await prisma.offer.update({ where: { id }, data });
};
