"use server";

import {
   UpdateSellerLocationArgs,
   createSellerLocation,
   updateSellerLocation,
} from "@/app/db/seller-location";
import { authWithSeller } from "@/auth/auth";

export async function getSellerLocation() {
   const session = await authWithSeller();

   if (!session || !session.seller || !session.seller.location) return null;
   return session.seller.location;
}

export async function upsertSellerLocation({
   countryCode,
   countryName,
   postalCode,
   city,
   latitude,
   longitude,
}: Omit<UpdateSellerLocationArgs, "sellerId">) {
   const session = await authWithSeller();

   if (!session || !session.seller) return;

   if (!session.seller.location) {
      const createdLocation = await createSellerLocation({
         sellerId: session.seller.id,
         countryCode,
         countryName,
         postalCode,
         city,
         longitude,
         latitude,
      });

      console.log("Created Seller Location", createdLocation);

      return createdLocation;
   }

   const updatedLocation = await updateSellerLocation({
      sellerId: session.seller.id,
      countryCode,
      countryName,
      postalCode,
      city,
      longitude,
      latitude,
   });
   console.log("Update Seller Location", updatedLocation);
   return updatedLocation;
}
