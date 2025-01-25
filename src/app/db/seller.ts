import "server-only";

import { auth } from "@/auth/auth";
import { prisma } from "@/prisma";

import { SellerLocation } from "../../../prisma/prismaClientExtensions";

type SellerResult = {
   sellerId: string;
   plan: string;
   maxDistanceKm: number;
   numberOfSentOffers: number;
   locationId: string | null;
   countryCode: string | null;
   countryName: string | null;
   postalCode: string | null;
   city: string | null;
   longitude: number | null;
   latitude: number | null;
   createdAt: Date | null;
   updatedAt: Date | null;
}[];

export const getSellerByUserId = async (userId: string) => {
   const result = await prisma.$queryRaw<SellerResult>`
        SELECT 
            s.id AS "sellerId",
            s.plan AS "plan",
            s.max_distance_km AS "maxDistanceKm",
            s.number_of_sent_offers AS "numberOfSentOffers",
            l.id AS "locationId",
            l.country_code AS "countryCode",
            l.country_name AS "countryName",
            l.postal_code AS "postalCode",
            l.city AS "city",
            ST_X(l.coordinates::geometry) AS "longitude", 
            ST_Y(l.coordinates::geometry) AS "latitude",
            l.created_at AS "createdAt",
            l.updated_at AS "updatedAt"
        FROM 
            "Seller" s
        LEFT JOIN 
            "SellerLocation" l
        ON 
            s.id = l.seller_id
        WHERE 
            s.user_id = ${userId};
    `;

   if (result.length === 0) return null;

   const { sellerId, plan, maxDistanceKm, numberOfSentOffers, ...locationData } = result[0];

   const location: SellerLocation | null = locationData.locationId
      ? {
           id: locationData.locationId!,
           sellerId,
           countryCode: locationData.countryCode!,
           countryName: locationData.countryName!,
           postalCode: locationData.postalCode!,
           city: locationData.city!,
           coordinates: {
              latitude: locationData.latitude!,
              longitude: locationData.longitude!,
           },
           createdAt: locationData.createdAt!,
           updatedAt: locationData.updatedAt!,
        }
      : null;

   return {
      id: sellerId,
      plan,
      maxDistanceKm,
      numberOfSentOffers,
      userId,
      location,
   };
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
