import { PrismaClient } from "@prisma/client";
import cuid from "cuid";

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

type UpdateRaw = {
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

export function extendPrismaClientWithSellerLocation(prisma: PrismaClient) {
   return prisma.$extends({
      model: {
         sellerLocation: {
            async create(data: {
               sellerId: string;
               countryCode: string;
               countryName: string;
               postalCode: string;
               city: string;
               latitude: number;
               longitude: number;
               maxDistanceKm: number;
               address: string | null;
            }) {
               const id = cuid(); // This is necessary because prisma could not automatically generate the cuid
               const point = `POINT(${data.longitude} ${data.latitude})`;

               const result = await prisma.$queryRaw<
                  { id: string; created_at: string; updated_at: string }[]
               >`
                  INSERT INTO "SellerLocation"
                     (id, seller_id, country_code, country_name, postal_code, city, address, coordinates, max_distance_km, created_at, updated_at)
                  VALUES
                     (${id}, ${data.sellerId}, ${data.countryCode}, ${data.countryName}, ${data.postalCode}, ${data.city}, ${data.address}, ST_GeomFromText(${point}, 4326), ${data.maxDistanceKm}, now(), now())
                  RETURNING id, created_at, updated_at`;

               // TODO: Improve error handling
               if (result.length < 1) {
                  throw new Error("Could not create seller location");
               }
               // Return the created location with the id
               const location: SellerLocation = {
                  id: result[0].id,
                  sellerId: data.sellerId,
                  countryCode: data.countryCode,
                  countryName: data.countryName,
                  postalCode: data.postalCode,
                  city: data.city,
                  address: data.address,
                  coordinates: {
                     latitude: data.latitude,
                     longitude: data.longitude,
                  },
                  maxDistanceKm: data.maxDistanceKm,
                  createdAt: new Date(result[0].created_at),
                  updatedAt: new Date(result[0].updated_at),
               };
               // TODO: Remove debug
               console.log("Created", location);
               return location;
            },

            async update(
               sellerId: string,
               data: {
                  countryCode: string;
                  countryName: string;
                  postalCode: string;
                  city: string;
                  address: string | null;
                  latitude: number;
                  longitude: number;
                  maxDistanceKm: number;
               }
            ) {
               const countryCode = data.countryCode;
               const countryName = data.countryName;
               const postalCode = data.postalCode;
               const city = data.city;
               const latitude = data.latitude;
               const longitude = data.longitude;
               const point = `POINT(${longitude} ${latitude})`;
               const maxDistanceKm = data.maxDistanceKm;
               const address = data.address;

               const result = await prisma.$queryRaw<UpdateRaw>`
                  UPDATE "SellerLocation"
                  SET
                     country_code = ${countryCode},
                     country_name = ${countryName},
                     postal_code = ${postalCode},
                     city = ${city},
                     "address" = ${address},
                     coordinates = ST_GeomFromText(${point}, 4326),
                     max_distance_km = ${maxDistanceKm},
                     updated_at = now()
                  WHERE seller_id = ${sellerId}
                  RETURNING id, seller_id, country_code, country_name, postal_code, city, "address", ST_X(coordinates::geometry) AS longitude, ST_Y(coordinates::geometry) AS latitude, max_distance_km, created_at, updated_at
               `;

               console.log({ result });

               if (result.length < 1) {
                  throw new Error(`Could not update seller location with seller id: ${sellerId}`);
               }

               const location: SellerLocation = {
                  id: result[0].id,
                  sellerId: result[0].seller_id,
                  countryCode: result[0].country_code,
                  countryName: result[0].country_name,
                  postalCode: result[0].postal_code,
                  city: result[0].city,
                  address: result[0].address,
                  coordinates: {
                     latitude: result[0].latitude,
                     longitude: result[0].longitude,
                  },
                  maxDistanceKm: result[0].max_distance_km,
                  createdAt: new Date(result[0].created_at),
                  updatedAt: new Date(result[0].updated_at),
               };

               console.log("Updated", location);
               return location;
            },
         },
      },
   });
}
