import "server-only";

import { DeliveryMethod, Prisma } from "@prisma/client";

import { prisma } from "@/prisma";

type SellerRaw = {
   seller_id: string;
   st_x: number;
   st_y: number;
}[];

/**
 * Finds all sellers that have maxDistanceKm lower than the distance in km and isActive set to true
 * @returns Array of Sellers
 */
export const findSellersWithinDistance = async ({
   deliveryMethods,
   longitude,
   latitude,
}: {
   deliveryMethods: DeliveryMethod[];
   longitude: number;
   latitude: number;
}) => {
   const safeLongitude = Number(longitude);
   const safeLatitude = Number(latitude);

   if (isNaN(safeLongitude) || isNaN(safeLatitude)) {
      throw new Error("Invalid longitude or latitude");
   }

   // Require sellers to have address set if the request only has pickup as delivery method
   const includeAddressCondition =
      deliveryMethods.includes(DeliveryMethod.PICKUP) &&
      !deliveryMethods.includes(DeliveryMethod.HOME_DELIVERY)
         ? "AND l.address IS NOT NULL"
         : "";

   // Construct the SQL query **as a full string**
   const query = Prisma.sql`
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
         s.is_active = true
         ${Prisma.raw(includeAddressCondition)}
         AND ST_DistanceSphere(l.coordinates::geometry, ST_MakePoint(${safeLongitude}, ${safeLatitude})) <= (l.max_distance_km * 1000);
   `;

   // Use Prisma's $queryRaw to execute safely
   const result = await prisma.$queryRaw<SellerRaw>(query);
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

export type SellerLocationArgs = {
   sellerId: string;
   countryCode: string;
   countryName: string;
   postalCode: string;
   city: string;
   latitude: number;
   longitude: number;
   maxDistanceKm: number;
   address: string;
};

export const createSellerLocation = async ({
   sellerId,
   countryCode,
   countryName,
   postalCode,
   city,
   address,
   latitude,
   longitude,
   maxDistanceKm,
}: SellerLocationArgs) => {
   const location = await prisma.sellerLocation.create({
      sellerId,
      countryCode,
      countryName,
      postalCode,
      city,
      address: address === "" ? null : address,
      latitude,
      longitude,
      maxDistanceKm,
   });
   return location;
};

export const updateSellerLocation = async ({
   sellerId,
   countryCode,
   countryName,
   postalCode,
   city,
   address,
   latitude,
   longitude,
   maxDistanceKm,
}: SellerLocationArgs) => {
   const location = await prisma.sellerLocation.update(sellerId, {
      countryCode,
      countryName,
      postalCode,
      city,
      address: address === "" ? null : address,
      latitude,
      longitude,
      maxDistanceKm,
   });
   return location;
};
