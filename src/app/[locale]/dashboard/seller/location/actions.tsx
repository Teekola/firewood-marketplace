"use server";

import { Prisma } from "@prisma/client";

import {
   SellerLocationArgs,
   createSellerLocation,
   updateSellerLocation,
} from "@/app/db/seller-location";
import { authWithSeller } from "@/auth/auth";
import { AuthError, DatabaseError, UnknownError } from "@/lib/utils/errors";

export async function getSellerLocation() {
   const session = await authWithSeller();

   if (!session || !session.seller || !session.seller.location) return null;
   return session.seller.location;
}

function handleDatabaseErrors(error: unknown) {
   if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError({
         name: "DATABASE_ERROR",
         message: error.message,
         code: Number(error.code),
      });
   } else {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred.";
      throw new UnknownError({ name: "UNHANDLED_ERROR", message: errorMessage, code: 500 });
   }
}

export async function upsertSellerLocation({
   countryCode,
   countryName,
   postalCode,
   city,
   latitude,
   longitude,
   maxDistanceKm,
}: Omit<SellerLocationArgs, "sellerId">) {
   const session = await authWithSeller();

   if (!session || !session.seller) {
      throw new AuthError({ name: "SESSION_ERROR", message: "There is no session.", code: 400 });
   }

   if (!session.seller) {
      throw new AuthError({
         name: "SESSION_ERROR",
         message: "The user does not have seller.",
         code: 400,
      });
   }

   if (!session.seller.location) {
      try {
         const createdLocation = await createSellerLocation({
            sellerId: session.seller.id,
            countryCode,
            countryName,
            postalCode,
            city,
            longitude,
            latitude,
            maxDistanceKm,
         });
         console.log("Created Seller Location", createdLocation);

         return createdLocation;
      } catch (error) {
         handleDatabaseErrors(error);
      }
   }

   try {
      const updatedLocation = await updateSellerLocation({
         sellerId: session.seller.id,
         countryCode,
         countryName,
         postalCode,
         city,
         longitude,
         latitude,
         maxDistanceKm,
      });
      console.log("Update Seller Location", updatedLocation);
      return updatedLocation;
   } catch (error) {
      handleDatabaseErrors(error);
   }
}
