import { Currency, Prisma } from "@prisma/client";

import { prisma } from "@/prisma";

const offerDTOFields = Prisma.validator<Prisma.OfferSelect>()({
   id: true,
   quotationRequestId: true,
   sellerId: true,
   price: true,
   currency: true,
   earliestAvailability: true,
   createdAt: true,
   updatedAt: true,
   acceptedAt: true,
   rejectedAt: true,
});

export type OfferDTO = Prisma.OfferGetPayload<{ select: typeof offerDTOFields }>;

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

export const getActiveOffersBySellerId = async ({ sellerId }: { sellerId: string }) => {
   const offers = await prisma.offer.findMany({
      where: { sellerId, acceptedAt: null },
      select: offerDTOFields,
   });
   return offers;
};
