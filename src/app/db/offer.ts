import { Currency, Prisma, QuotationRequestStatus } from "@prisma/client";

import { SortOrder } from "@/lib/utils/types";
import { prisma } from "@/prisma";

export const offerDTOFields = Prisma.validator<Prisma.OfferSelect>()({
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
   seller: {
      select: {
         profile: {
            select: {
               name: true,
               email: true,
               phone: true,
            },
         },
      },
   },
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
         updatedAt: new Date(),
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

export const getPendingOffersForBuyerByQuotationRequestIdPaginated = async ({
   id,
   cursor,
   limit,
   sort = "newest-first",
}: {
   id: string;
   cursor: string | null;
   limit: number;
   sort?: SortOrder;
}) => {
   const offers = await prisma.offer.findMany({
      where: { quotationRequestId: id, acceptedAt: null, rejectedAt: null },
      select: offerDTOFields,
      take: limit + 1, // take 1 extra to check if there is more data and use as cursor
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: sort === "newest-first" ? "desc" : "asc" },
   });
   return offers;
};

export const getRejectedOffersForBuyerByQuotationRequestIdPaginated = async ({
   id,
   cursor,
   limit,
   sort = "newest-first",
}: {
   id: string;
   cursor: string | null;
   limit: number;
   sort?: SortOrder;
}) => {
   const offers = await prisma.offer.findMany({
      where: { quotationRequestId: id, acceptedAt: null, NOT: { rejectedAt: null } },
      select: offerDTOFields,
      take: limit + 1, // take 1 extra to check if there is more data and use as cursor
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: sort === "newest-first" ? "desc" : "asc" },
   });
   return offers;
};

export const getPendingOffersCountForBuyerByQuotationRequestId = async ({ id }: { id: string }) => {
   const count = await prisma.offer.count({
      where: { quotationRequestId: id, acceptedAt: null, rejectedAt: null },
   });
   return count;
};

export const getRejectedOffersCountForBuyerByQuotationRequestId = async ({
   id,
}: {
   id: string;
}) => {
   const count = await prisma.offer.count({
      where: { quotationRequestId: id, acceptedAt: null, NOT: { rejectedAt: null } },
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
   await prisma.offer.update({
      where: { id },
      data: { ...data, updatedAt: data.updatedAt ?? new Date() },
   });
};

export const deleteOfferById = async (id: string) => {
   await prisma.offer.delete({ where: { id } });
};

export const getSentOffersNotificationCountBySellerId = async (sellerId: string) => {
   return await prisma.offer.count({
      where: { sellerId, NOT: { rejectedAt: null } },
   });
};

export const rejectOfferById = async ({
   offerId,
   quotationRequestId,
   isAcceptedOffer,
}: {
   offerId: string;
   quotationRequestId: string;
   isAcceptedOffer: boolean;
}) => {
   const date = new Date();
   await prisma.$transaction([
      prisma.offer.update({
         where: { id: offerId },
         data: {
            rejectedAt: date,
            acceptedAt: null,
         },
      }),
      ...(isAcceptedOffer
         ? [
              prisma.quotationRequest.update({
                 where: { id: quotationRequestId },
                 data: { status: QuotationRequestStatus.PENDING },
              }),
           ]
         : []),
   ]);
};

// TODO: Handle the case where quotation request is Fulfilled and provide sellers with appropriate information
// If their offer was not selected, they will be shown the price details etc. of the offer that was accepted
// The offer and quotation request are moved from pending states
export const acceptOfferById = async ({
   offerId,
   quotationRequestId,
}: {
   offerId: string;
   quotationRequestId: string;
}) => {
   const date = new Date();
   await prisma.$transaction([
      prisma.offer.update({
         where: { id: offerId },
         data: {
            rejectedAt: null,
            acceptedAt: date,
         },
      }),
      prisma.quotationRequest.update({
         where: { id: quotationRequestId },
         data: {
            status: QuotationRequestStatus.FULFILLED,
         },
      }),
   ]);
};
