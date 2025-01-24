import "server-only";

import { prisma } from "@/prisma";

type SellerRaw = {
   seller_id: string;
   st_x: number;
   st_y: number;
}[];

/**
 * Finds all sellers that have maxDistanceKm lower than the distance in km
 * @returns Array of Sellers
 */
export const findSellersWithinDistance = async ({
   longitude,
   latitude,
}: {
   longitude: number;
   latitude: number;
}) => {
   const result = await prisma.$queryRaw<SellerRaw>`
      SELECT
         s.id AS seller_id,
         ST_X(l.coordinates::geometry) AS st_x,
         ST_Y(l.coordinates::geometry) AS st_y
      FROM
         "Seller" s
      JOIN
         "SellerLocation" l
         ON s.id = l.seller_id
      WHERE
         ST_DistanceSphere(l.coordinates::geometry, ST_MakePoint(${longitude}, ${latitude})) <= (s.max_distance_km * 1000);
   `;

   // Transform to custom Seller type
   const sellers = result.map((data) => {
      return {
         id: data.seller_id,
         coordinates: {
            longitude: data.st_x,
            latitude: data.st_y,
         },
      };
   });

   return sellers;
};

export const createSellerLocation = async ({
   sellerId,
   countryCode,
   countryName,
   postalCode,
   city,
   latitude,
   longitude,
}: {
   sellerId: string;
   countryCode: string;
   countryName: string;
   postalCode: string;
   city: string;
   latitude: number;
   longitude: number;
}) => {
   const location = await prisma.sellerLocation.create({
      sellerId,
      countryCode,
      countryName,
      postalCode,
      city,
      latitude,
      longitude,
   });
   return location;
};

export type UpdateSellerLocationArgs = {
   sellerId: string;
   countryCode: string;
   countryName: string;
   postalCode: string;
   city: string;
   latitude: number;
   longitude: number;
};

export const updateSellerLocation = async ({
   sellerId,
   countryCode,
   countryName,
   postalCode,
   city,
   latitude,
   longitude,
}: UpdateSellerLocationArgs) => {
   const location = await prisma.sellerLocation.update(sellerId, {
      countryCode,
      countryName,
      postalCode,
      city,
      latitude,
      longitude,
   });
   return location;
};
