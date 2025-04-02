"use server";

import { Prisma } from "@prisma/client";

import { authWithSeller } from "@/auth/auth";
import { SellerProfileArgs, createSellerProfile, updateSellerProfile } from "@/db/seller-profile";
import { AuthError, DatabaseError, UnknownError } from "@/lib/utils/errors";

export async function getSellerProfile() {
   const session = await authWithSeller();

   if (!session || !session.seller || !session.seller.profile) return null;
   return session.seller.profile;
}

function handleDatabaseErrors(error: unknown) {
   if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError({
         name: "DATABASE_ERROR",
         message: error.message,
         code: error.code,
      });
   } else {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred.";
      throw new UnknownError({ name: "UNHANDLED_ERROR", message: errorMessage, code: "500" });
   }
}

export async function upsertSellerProfile({
   name,
   email,
   phone,
}: Omit<SellerProfileArgs, "sellerId">) {
   const session = await authWithSeller();

   if (!session || !session.seller) {
      throw new AuthError({ name: "SESSION_ERROR", message: "There is no session.", code: "400" });
   }

   if (!session.seller) {
      throw new AuthError({
         name: "SESSION_ERROR",
         message: "The user does not have seller.",
         code: "400",
      });
   }

   if (!session.seller.profile) {
      try {
         const createdProfile = await createSellerProfile({
            sellerId: session.seller.id,
            name,
            email,
            phone,
         });
         console.log("Created Seller Location", createdProfile);

         return createdProfile;
      } catch (error) {
         handleDatabaseErrors(error);
      }
   }

   try {
      const updatedProfile = await updateSellerProfile({
         sellerId: session.seller.id,
         name,
         email,
         phone,
      });
      console.log("Update Seller Location", updatedProfile);
      return updatedProfile;
   } catch (error) {
      handleDatabaseErrors(error);
   }
}
