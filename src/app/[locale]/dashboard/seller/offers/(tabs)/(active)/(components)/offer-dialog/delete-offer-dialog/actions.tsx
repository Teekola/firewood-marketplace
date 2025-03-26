"use server";

import { Prisma, SellerQuotationRequestStatus } from "@prisma/client";

import { deleteOfferById } from "@/app/db/offer";
import { updateSellerQuotationRequestStatus } from "@/app/db/quotation-request";
import { getAuthorizedSeller } from "@/auth/auth";

export async function deleteOffer({
   offerId,
   quotationRequestId,
}: {
   offerId: string;
   quotationRequestId: string;
}) {
   const { seller } = await getAuthorizedSeller();

   try {
      await updateSellerQuotationRequestStatus({
         quotationRequestId,
         status: SellerQuotationRequestStatus.PENDING,
         sellerId: seller.id,
      });
   } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
         console.log("The seller quotation request has been deleted.");
      } else {
         console.error(error);
      }
   }
   await deleteOfferById(offerId);
}
