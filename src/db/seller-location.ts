import "server-only";

import { DeliveryMethod, Prisma } from "@prisma/client";
import cuid from "cuid";

import { prisma } from "@/lib/prisma";

type Coordinates = {
   latitude: number;
   longitude: number;
};

export type SellerLocation = {
   id: string;
   sellerId: string;
   countryCode: string;
   countryName: string;
   postalCode: string;
   city: string;
   coordinates: Coordinates;
   maxDistanceKm: number;
   createdAt: Date;
   updatedAt: Date;
   address: string | null;
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

type CreateSellerLocationRawReturn = {
   id: string;
   created_at: string;
   updated_at: string;
}[];

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
   const id = cuid(); // This is necessary because prisma could not automatically generate the cuid
   const point = `POINT(${longitude} ${latitude})`;
   const addressCreateValue = address === "" ? null : address;

   const [result] = await prisma.$queryRaw<CreateSellerLocationRawReturn>`
                     INSERT INTO "SellerLocation"
                        (id, seller_id, country_code, country_name, postal_code, city, "address", coordinates, max_distance_km, created_at, updated_at)
                     VALUES
                        (${id}, ${sellerId}, ${countryCode}, ${countryName}, ${postalCode}, ${city}, ${addressCreateValue}, ST_GeomFromText(${point}, 4326), ${maxDistanceKm}, now(), now())
                     RETURNING id, created_at, updated_at`;

   // TODO: Improve error handling
   if (!result) {
      throw new Error("Could not create seller location");
   }
   // Return the created location with the id
   const location: SellerLocation = {
      id: result.id,
      sellerId,
      countryCode,
      countryName,
      postalCode,
      city,
      address,
      coordinates: {
         latitude,
         longitude,
      },
      maxDistanceKm: maxDistanceKm,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
   };
   // TODO: Remove debug
   console.log("Created", location);
   return location;
};

type UpdateSellerLocationRawReturn = {
   id: string;
   seller_id: string;
   country_code: string;
   country_name: string;
   postal_code: string;
   city: string;
   longitude: number;
   latitude: number;
   max_distance_km: number;
   created_at: string;
   updated_at: string;
   address: string | null;
}[];

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
   const point = `POINT(${longitude} ${latitude})`;
   const addressUpdateValue = address === "" ? null : address;

   const query = Prisma.sql`
      UPDATE "SellerLocation"
      SET
         country_code = ${countryCode},
         country_name = ${countryName},
         postal_code = ${postalCode},
         city = ${city},
         "address" = ${addressUpdateValue},
         coordinates = ST_GeomFromText(${point}, 4326),
         max_distance_km = ${maxDistanceKm},
         updated_at = now()
      WHERE seller_id = ${sellerId}
      RETURNING 
         id, 
         seller_id, 
         country_code, 
         country_name, 
         postal_code, 
         city, 
         "address", 
         ST_X(coordinates::geometry) AS longitude, 
         ST_Y(coordinates::geometry) AS latitude, 
         max_distance_km, created_at, 
         updated_at
      `;

   const [result] = await prisma.$queryRaw<UpdateSellerLocationRawReturn>(query);

   if (!result) {
      throw new Error(`Could not update seller location with seller id: ${sellerId}`);
   }

   const location: SellerLocation = {
      id: result.id,
      sellerId: result.seller_id,
      countryCode: result.country_code,
      countryName: result.country_name,
      postalCode: result.postal_code,
      city: result.city,
      address: result.address,
      coordinates: {
         latitude: result.latitude,
         longitude: result.longitude,
      },
      maxDistanceKm: result.max_distance_km,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
   };

   // TODO: Remove debug
   console.log("Updated", location);
   return location;
};

type FindSellersWithinDistanceRawReturn = {
   seller_id: string;
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
   // Require sellers to have address set if the request only has pickup as delivery method
   const includeAddressCondition =
      deliveryMethods.includes(DeliveryMethod.PICKUP) &&
      !deliveryMethods.includes(DeliveryMethod.HOME_DELIVERY)
         ? "AND l.address IS NOT NULL"
         : "";

   const query = Prisma.sql`
      SELECT
         s.id AS seller_id
      FROM
         "Seller" s
      JOIN
         "SellerLocation" l
         ON s.id = l.seller_id
      WHERE
         s.is_active = true
         ${Prisma.raw(includeAddressCondition)}
         AND ST_Distance(l.coordinates::geography, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography) <= (l.max_distance_km * 1000);
   `;

   const result = await prisma.$queryRaw<FindSellersWithinDistanceRawReturn>(query);

   const sellers = result.map((data) => {
      return {
         id: data.seller_id,
      };
   });

   return sellers;
};
