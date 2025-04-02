import "server-only";

import { prisma } from "@/prisma";

export type SellerProfileArgs = {
   sellerId: string;
   name: string;
   email: string;
   phone: string;
};

export const createSellerProfile = async ({ sellerId, name, email, phone }: SellerProfileArgs) => {
   const profile = await prisma.sellerProfile.create({
      data: {
         name,
         email,
         phone,
         sellerId,
      },
   });
   return profile;
};

export const updateSellerProfile = async ({ sellerId, name, email, phone }: SellerProfileArgs) => {
   const profile = await prisma.sellerProfile.update({
      where: { sellerId },
      data: {
         name: valueOrNullOnEmptyString(name),
         email: valueOrNullOnEmptyString(email),
         phone: valueOrNullOnEmptyString(phone),
      },
   });
   return profile;
};

function valueOrNullOnEmptyString(v: string) {
   return v !== "" ? v : null;
}
