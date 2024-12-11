import "server-only";

import { auth } from "@/auth/auth";
import { prisma } from "@/prisma";

// TODO: create Seller DTO
const getSellerByUserId = async (userId: string) => {
   const seller = await prisma.seller.findUnique({
      where: { userId },
      select: {
         id: true,
         plan: true,
         location: true,
      },
   });

   if (!seller) return null;

   return seller;
};

/**
 * Gets the authenticated user's seller
 */
export const getSeller = async () => {
   const session = await auth();

   if (!session) {
      return null;
   }
   const userId = session.user.id;

   const seller = await getSellerByUserId(userId);
   return seller;
};
