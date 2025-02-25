import {
   DeliveryMethod,
   SellerQuotationRequestStatus,
   WoodDryness,
   WoodType,
} from "@prisma/client";

import { SortOrder } from "@/lib/utils/types";
import { prisma } from "@/prisma";

import { ContactData } from "../[locale]/request-offers/(stepper)/contact/contact-form";
import { DeliveryData } from "../[locale]/request-offers/(stepper)/delivery/delivery-form";
import { FirewoodData } from "../[locale]/request-offers/(stepper)/firewood/firewood-form";
import { SubmitData } from "../[locale]/request-offers/(stepper)/submit/submit-form";

const toEnum = {
   mixed: WoodType.MIXED,
   birch: WoodType.BIRCH,
   pine: WoodType.PINE,
   any: WoodDryness.ANY,
   dry: WoodDryness.DRY,
   green: WoodDryness.GREEN,
   homeDelivery: DeliveryMethod.HOME_DELIVERY,
   pickup: DeliveryMethod.PICKUP,
} as const;

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

export const getRejectedQuotationRequestsBySellerId = async ({
   sellerId,
}: {
   sellerId: string;
}) => {
   const quotationRequests = await prisma.sellerQuotationRequest.findMany({
      where: { sellerId, status: SellerQuotationRequestStatus.REJECTED },
      select: {
         quotationRequest: true,
      },
   });

   return quotationRequests;
};

export type QuotationRequest = Awaited<
   ReturnType<typeof getPendingQuotationRequestsBySellerIdPaginated>
>[number]["quotationRequest"];

export const getQuotationRequest = async ({ id }: { id: string }) => {
   return await prisma.quotationRequest.findUnique({ where: { id } });
};

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
   return await prisma.quotationRequest.create({
      data: {
         buyerId,
         sellerQuotationRequest: {
            createMany: {
               data: sellerIds.map((sellerId) => ({ sellerId })),
            },
         },
         woodType: toEnum[firewoodData.woodType],
         woodDryness: toEnum[firewoodData.dryness],
         ...(firewoodData.maxLength && { woodMaxLengthCm: Number(firewoodData.maxLength) }),
         woodAmountCubicMeters: Number(firewoodData.amount),
         deliveryMethod: toEnum[deliveryData.deliveryMethod],
         countryCode: deliveryData.countryCode,
         countryName: deliveryData.countryName,
         postalCode: deliveryData.postalCode,
         city: deliveryData.city,
         ...(deliveryData.address && { address: deliveryData.address }),
         buyerName: contactData.name,
         buyerEmail: contactData.email,
         buyerPhone: contactData.phone,
         ...(contactData.isCompany && { buyerCompanyName: contactData.companyName }),
         ...(submitData.additionalInformation && {
            additionalInformation: submitData.additionalInformation,
         }),
      },
      select: {
         id: true,
         _count: {
            select: { sellerQuotationRequest: true },
         },
      },
   });
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
