import { Currency, DeliveryMethod, Prisma, QuotationRequestStatus } from "@prisma/client";

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
   deliveryMethods: true,
   pickupCountryCode: true,
   pickupCountryName: true,
   pickupAddress: true,
   pickupCity: true,
   pickupPostalCode: true,
   createdAt: true,
   updatedAt: true,
   buyerLastSeenAt: true,
   sellerLastSeenAt: true,
   acceptedAt: true,
   rejectedAt: true,
   isActive: true,
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
   deliveryMethods: DeliveryMethod[];
   pickupCountryCode?: string;
   pickupCountryName?: string;
   pickupPostalCode?: string;
   pickupCity?: string;
   pickupAddress?: string;
}

export const createOffer = async ({
   quotationRequestId,
   sellerId,
   price,
   currency,
   earliestAvailability,
   deliveryMethods,
   pickupCountryCode,
   pickupCountryName,
   pickupPostalCode,
   pickupCity,
   pickupAddress,
}: CreateOfferArgs) => {
   const creationDate = new Date();
   const offer = await prisma.offer.create({
      data: {
         quotationRequest: {
            connect: { id: quotationRequestId },
         },
         seller: {
            connect: { id: sellerId },
         },
         price,
         deliveryMethods,
         currency,
         earliestAvailability,
         pickupCountryCode,
         pickupCountryName,
         pickupPostalCode,
         pickupCity,
         pickupAddress,
         updatedAt: creationDate,
         sellerLastSeenAt: creationDate,
         createdAt: creationDate,
         isActive: true,
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
      where: { sellerId, isActive: true },
      select: offerDTOFields,
      take: limit + 1, // take 1 extra to check if there is more data and use as cursor
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: sort === "newest-first" ? "desc" : "asc" },
   });
   return offers;
};

export const getActiveOffersCountBySellerId = async ({ sellerId }: { sellerId: string }) => {
   const count = await prisma.offer.count({
      where: { sellerId, isActive: true },
   });
   return count;
};

export const getAcceptedOffersBySellerIdPaginated = async ({
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
      where: { sellerId, NOT: { acceptedAt: null } },
      select: offerDTOFields,
      take: limit + 1, // take 1 extra to check if there is more data and use as cursor
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: sort === "newest-first" ? "desc" : "asc" },
   });
   return offers;
};

export const getAcceptedOffersCountBySellerId = async ({ sellerId }: { sellerId: string }) => {
   const count = await prisma.offer.count({
      where: { sellerId, NOT: { acceptedAt: null } },
   });
   return count;
};

export const getLostOffersBySellerIdPaginated = async ({
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
      where: { sellerId, acceptedAt: null, isActive: false },
      select: offerDTOFields,
      take: limit + 1, // take 1 extra to check if there is more data and use as cursor
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: sort === "newest-first" ? "desc" : "asc" },
   });
   return offers;
};

export const getLostOffersCountBySellerId = async ({ sellerId }: { sellerId: string }) => {
   const count = await prisma.offer.count({
      where: { sellerId, acceptedAt: null, isActive: false },
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
      where: { quotationRequestId: id, acceptedAt: null, rejectedAt: null, isActive: true },
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
      where: { quotationRequestId: id, acceptedAt: null, rejectedAt: null, isActive: true },
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

// Get number of offers that have been rejected after the last seen at
// time of the seller and those that have been accepted after the last seen at time of seller
export const getSentOffersNotificationCountBySellerId = async (sellerId: string) => {
   return await prisma.offer.count({
      where: {
         sellerId,
         OR: [
            { rejectedAt: { gt: prisma.offer.fields.sellerLastSeenAt } },
            { acceptedAt: { gt: prisma.offer.fields.sellerLastSeenAt } },
         ],
      },
   });
};

export const getSentOffersAcceptedNotificationCountBySellerId = async (sellerId: string) => {
   return await prisma.offer.count({
      where: {
         sellerId,
         OR: [{ acceptedAt: { gt: prisma.offer.fields.sellerLastSeenAt } }],
      },
   });
};

export const getSentOffersRejectedNotificationCountBySellerId = async (sellerId: string) => {
   return await prisma.offer.count({
      where: {
         sellerId,
         OR: [{ rejectedAt: { gt: prisma.offer.fields.sellerLastSeenAt } }],
      },
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
              prisma.offer.updateMany({
                 where: { quotationRequestId },
                 data: { isActive: true },
              }),
           ]
         : []),
   ]);
};

export const updateOfferViewedAt = async ({
   offerIds,
   type,
}: {
   offerIds: string[];
   type: "buyerLastSeenAt" | "sellerLastSeenAt";
}) => {
   await prisma.offer.updateMany({
      where: { id: { in: offerIds } },
      data: {
         [type]: new Date(),
      },
   });
};

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
            isActive: false,
         },
      }),
      prisma.quotationRequest.update({
         where: { id: quotationRequestId },
         data: {
            status: QuotationRequestStatus.FULFILLED,
         },
      }),
      prisma.offer.updateMany({
         where: { quotationRequestId, NOT: { id: offerId } },
         data: { isActive: false },
      }),
   ]);
};

export const getUnseenOffersCountByBuyerId = async (buyerId: string) => {
   const offersCount = await prisma.offer.count({
      where: {
         quotationRequest: { buyerId },
         OR: [
            { buyerLastSeenAt: null },
            { buyerLastSeenAt: { lt: prisma.offer.fields.updatedAt } },
         ],
      },
   });

   return offersCount;
};
