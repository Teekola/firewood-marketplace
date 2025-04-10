import { Prisma, QuotationRequestStatus, SellerQuotationRequestStatus } from "@prisma/client";
import cuid from "cuid";

import { FirewoodData } from "@/app/[locale]/request-offers/(stepper)/firewood/_components/firewood-form";
import { SubmitData } from "@/app/[locale]/request-offers/(stepper)/submit/_components/submit-form";
import { prisma } from "@/lib/prisma/prisma";
import { SortOrder } from "@/lib/utils/types";

import { ContactData } from "../app/[locale]/request-offers/(stepper)/contact/_components/contact-form";
import { DeliveryData } from "../app/[locale]/request-offers/(stepper)/delivery/_components/delivery-form";
import { offerDTOFields } from "./offer";

export const getPendingQuotationRequestsBySellerIdPaginated = async ({
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
   const quotationRequests = await prisma.sellerQuotationRequest.findMany({
      where: { sellerId, status: SellerQuotationRequestStatus.PENDING },
      include: {
         quotationRequest: true,
      },
      take: limit + 1, // take 1 extra to check if there is more data and use as cursor
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: sort === "newest-first" ? "desc" : "asc" },
   });

   return quotationRequests;
};

export const getQuotationRequestsByBuyerIdAndStatusPaginated = async ({
   status,
   buyerId,
   cursor,
   limit,
   sort = "newest-first",
}: {
   buyerId: string;
   cursor: string | null;
   limit: number;
   status: QuotationRequestStatus;
   sort?: SortOrder;
}) => {
   const quotationRequests = await prisma.quotationRequest.findMany({
      where: { buyerId, status },
      take: limit + 1, // take 1 extra to check if there is more data and use as cursor
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: sort === "newest-first" ? "desc" : "asc" },
      include: {
         _count: {
            select: { offers: true },
         },
         offers: {
            select: {
               id: true,
               buyerLastSeenAt: true,
               updatedAt: true,
            },
         },
      },
   });

   // Calculate unseen offers count manually
   // TODO NOTE: This might not display all unseen as it only displays the fetched ones!
   const result = await Promise.all(
      quotationRequests.map(async (qr) => {
         const unseenOffersCount = qr.offers.filter(
            (offer) => !offer.buyerLastSeenAt || offer.buyerLastSeenAt < offer.updatedAt
         ).length;

         return {
            ...qr,
            unseenOffersCount,
         };
      })
   );

   return result;
};

export const getPendingQuotationRequestsCountBySellerId = async ({
   sellerId,
}: {
   sellerId: string;
}) => {
   const count = await prisma.sellerQuotationRequest.count({
      where: { sellerId, status: SellerQuotationRequestStatus.PENDING },
   });
   return count;
};

export const getQuotationRequestsCountByBuyerIdAndStatus = async ({
   buyerId,
   status,
}: {
   buyerId: string;
   status: QuotationRequestStatus;
}) => {
   const count = await prisma.quotationRequest.count({
      where: { buyerId, status },
   });
   return count;
};

export const getRejectedQuotationRequestsBySellerIdPaginated = async ({
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
   const quotationRequests = await prisma.sellerQuotationRequest.findMany({
      where: { sellerId, status: SellerQuotationRequestStatus.REJECTED },
      include: {
         quotationRequest: true,
      },
      take: limit + 1, // take 1 extra to check if there is more data and use as cursor
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { id: sort === "newest-first" ? "desc" : "asc" },
   });

   return quotationRequests;
};

export const getRejectedQuotationRequestCountBySellerId = async ({
   sellerId,
}: {
   sellerId: string;
}) => {
   const count = await prisma.sellerQuotationRequest.count({
      where: { sellerId, status: SellerQuotationRequestStatus.REJECTED },
   });
   return count;
};

export type QuotationRequest = NonNullable<Awaited<ReturnType<typeof getQuotationRequest>>>;

export type BuyerQuotationRequest = Awaited<
   ReturnType<typeof getQuotationRequestsByBuyerIdAndStatusPaginated>
>[number];

export const getQuotationRequest = async ({ id }: { id: string }) => {
   return await prisma.quotationRequest.findUnique({ where: { id } });
};

export const getQuotationRequestWithAcceptedOffer = async ({ id }: { id: string }) => {
   const quotationRequest = await prisma.quotationRequest.findUnique({
      where: { id },
      include: {
         offers: {
            select: offerDTOFields,
         },
      },
   });

   const acceptedOffer =
      quotationRequest?.offers.find((offer) => offer.acceptedAt !== null) ?? null;

   return { quotationRequest, acceptedOffer };
};
export type QuotationRequestWithAcceptedOfferId = Awaited<
   ReturnType<typeof getQuotationRequestWithAcceptedOffer>
>;

export const createQuotationRequest = async ({
   buyerId,
   sellerIds,
   firewoodData,
   deliveryData,
   submitData,
   contactData,
}: {
   buyerId: string;
   sellerIds: string[];
   firewoodData: FirewoodData;
   deliveryData: DeliveryData;
   contactData: ContactData;
   submitData: SubmitData;
}) => {
   const point = `POINT(${deliveryData.longitude} ${deliveryData.latitude})`;

   // Wrap everything in a transaction
   const result = await prisma.$transaction(async (prisma) => {
      // Step 1: Insert into QuotationRequest
      const maxLength = firewoodData.maxLength ? Number(firewoodData.maxLength) : null;
      const companyName = contactData.isCompany ? contactData.companyName || null : null;
      const additionalInformation = submitData.additionalInformation || null;
      const address = deliveryData.address || null;
      const [quotationResult] = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
            INSERT INTO "QuotationRequest" (
            "id", "buyer_id", "status", "created_at", "wood_type", "wood_dryness",
            "wood_amount_cubic_meters", "wood_max_length_cm", "delivery_methods",
            "country_code", "country_name", "postal_code", "city", "address",
            "coordinates", "buyer_name", "buyer_email", "buyer_phone", 
            "buyer_company_name", "additional_information"
            ) VALUES (
            ${cuid()}, ${buyerId}, ${QuotationRequestStatus.PENDING}, NOW(),
            ARRAY[${Prisma.join(firewoodData.woodTypes)}]::"WoodType"[], Array[${Prisma.join(firewoodData.dryness)}]::"WoodDryness"[], 
            ${Number(firewoodData.amount)}, ${maxLength},
            ARRAY[${Prisma.join(deliveryData.deliveryMethods)}]::"DeliveryMethod"[], ${deliveryData.countryCode}, ${deliveryData.countryName},
            ${deliveryData.postalCode}, ${deliveryData.city}, ${address},
            ST_GeomFromText(${point}, 4326),
            ${contactData.name}, ${contactData.email}, ${contactData.phone}, 
            ${companyName}, ${additionalInformation}
            ) RETURNING id;
         `);

      const quotationRequestId = quotationResult.id;

      if (!quotationRequestId) {
         throw new Error("Failed to insert QuotationRequest.");
      }

      // Step 2: Insert into SellerQuotationRequest using the QuotationRequest ID
      await prisma.sellerQuotationRequest.createMany({
         data: sellerIds.map((sellerId) => ({ sellerId, quotationRequestId })),
      });

      return {
         id: quotationRequestId,
         sellerQuotationRequestCount: sellerIds.length,
      };
   });

   return result;
};

export interface UpdateSellerQuotationRequestStatusArgs {
   status: SellerQuotationRequestStatus;
   quotationRequestId: string;
   sellerId: string;
}

export const updateSellerQuotationRequestStatus = async ({
   status,
   quotationRequestId,
   sellerId,
}: UpdateSellerQuotationRequestStatusArgs) => {
   const result = await prisma.sellerQuotationRequest.update({
      where: {
         quotationRequestId_sellerId: {
            quotationRequestId,
            sellerId,
         },
      },
      data: {
         status,
      },
   });
   return result;
};

export const updateSellerQuotationRequestViewedAt = async ({
   quotationRequestId,
   sellerId,
}: {
   quotationRequestId: string;
   sellerId: string;
}) => {
   await prisma.sellerQuotationRequest.update({
      where: {
         quotationRequestId_sellerId: {
            quotationRequestId,
            sellerId,
         },
      },
      data: {
         lastViewedAt: new Date(),
      },
   });
};

export const getNumberOfUnseenQuotationRequests = async ({ sellerId }: { sellerId: string }) => {
   const result = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*) AS count
      FROM "SellerQuotationRequest" sqr
      JOIN "QuotationRequest" qr ON sqr.quotation_request_id = qr.id
      WHERE sqr.seller_id = ${sellerId}
      AND (sqr.last_viewed_at IS NULL OR sqr.last_viewed_at < qr.updated_at)
   `;

   return Number(result[0]?.count || 0);
};

export const deleteQuotationRequestById = async (id: string) => {
   await prisma.quotationRequest.delete({ where: { id } });
};

export const addAllSuitableQuotationRequestsForSeller = async ({
   sellerId,
}: {
   sellerId: string;
}) => {
   // Fetch all suitable quotation requests within distance and matching delivery methods
   const quotationRequests = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT qr.id
      FROM "QuotationRequest" qr
      JOIN "SellerLocation" sl ON sl.seller_id = ${sellerId}
      WHERE qr.status = ${QuotationRequestStatus.PENDING}
      AND NOT EXISTS (
         SELECT 1 FROM "SellerQuotationRequest" sqr
         WHERE sqr.seller_id = ${sellerId} AND sqr.quotation_request_id = qr.id
      )
      AND qr.delivery_methods && ARRAY[
         CASE 
            WHEN sl.address IS NOT NULL THEN 'PICKUP'
            ELSE NULL 
         END,
         'HOME_DELIVERY'
      ]::"DeliveryMethod"[] 
      AND ST_Distance(qr.coordinates::geography, sl.coordinates::geography) <= (sl.max_distance_km * 1000);
   `);

   // Insert matching quotation requests
   const [created] = await prisma.$transaction([
      prisma.sellerQuotationRequest.createMany({
         data: quotationRequests.map((qr) => ({ sellerId, quotationRequestId: qr.id })),
         skipDuplicates: true,
      }),
      prisma.seller.update({ where: { id: sellerId }, data: { isActive: true } }),
   ]);

   return created.count;
};
