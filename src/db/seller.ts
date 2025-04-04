import "server-only";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/prisma";

import { SellerLocation } from "./seller-location";

type SellerResult = {
   sellerId: string;
   plan: string;
   numberOfSentOffers: number;
   isActive: boolean | null;
   locationId: string | null;
   countryCode: string | null;
   countryName: string | null;
   postalCode: string | null;
   city: string | null;
   address: string | null;
   longitude: number | null;
   latitude: number | null;
   maxDistanceKm: number | null;
   createdAt: Date | null;
   updatedAt: Date | null;
   profileId: string | null;
   sellerName: string | null;
   sellerEmail: string | null;
   sellerPhone: string | null;
}[];

export const getSellerByUserId = async (userId: string) => {
   const [result] = await prisma.$queryRaw<SellerResult>`
        SELECT 
            s.id AS "sellerId",
            s.plan AS "plan",
            s.number_of_sent_offers AS "numberOfSentOffers",
            s.is_active AS "isActive",
            l.id AS "locationId",
            l.country_code AS "countryCode",
            l.country_name AS "countryName",
            l.postal_code AS "postalCode",
            l.city AS "city",
            l.address AS "address",
            ST_X(l.coordinates::geometry) AS "longitude", 
            ST_Y(l.coordinates::geometry) AS "latitude",
            l.max_distance_km AS "maxDistanceKm",
            s.created_at AS "createdAt",
            s.updated_at AS "updatedAt",
            p.id AS "profileId",
            p.name AS "sellerName",
            p.email AS "sellerEmail",
            p.phone AS "sellerPhone"
        FROM "Seller" s
        LEFT JOIN "SellerLocation" l ON s.id = l.seller_id
        LEFT JOIN "SellerProfile" p ON s.id = p.seller_id
        WHERE s.user_id = ${userId};
    `;

   if (!result) return null;

   const {
      sellerId,
      plan,
      numberOfSentOffers,
      profileId,
      sellerName,
      sellerEmail,
      sellerPhone,
      isActive,
      ...locationData
   } = result;

   const location: SellerLocation | null = locationData.locationId
      ? {
           id: locationData.locationId!,
           sellerId,
           countryCode: locationData.countryCode!,
           countryName: locationData.countryName!,
           postalCode: locationData.postalCode!,
           city: locationData.city!,
           address: locationData.address,
           coordinates: {
              latitude: locationData.latitude!,
              longitude: locationData.longitude!,
           },
           maxDistanceKm: locationData.maxDistanceKm!,
           createdAt: locationData.createdAt!,
           updatedAt: locationData.updatedAt!,
        }
      : null;

   const profile = profileId
      ? {
           name: sellerName,
           email: sellerEmail,
           phone: sellerPhone,
        }
      : null;

   return {
      id: sellerId,
      plan,
      numberOfSentOffers,
      isActive,
      userId,
      location,
      profile,
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

export const deactivateSellerById = async (id: string) => {
   await prisma.$transaction([
      prisma.sellerQuotationRequest.deleteMany({ where: { sellerId: id } }),
      prisma.seller.update({ where: { id }, data: { isActive: false } }),
   ]);
};
