import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

import { env } from "@/env/server";

const connectionString = env.POSTGRES_PRISMA_URL;

type Coordinates = {
   latitude: number;
   longitude: number;
};

type Location = {
   id: string;
   countryCode: string;
   countryName: string;
   postalCode: string;
   coordinates: Coordinates;
   createdAt: string;
   updatedAt: string;
};

function extendPrismaClientWithLocation(prisma: PrismaClient) {
   return prisma.$extends({
      model: {
         location: {
            async create(data: {
               countryCode: string;
               countryName: string;
               postalCode: string;
               latitude: number;
               longitude: number;
            }) {
               // Create the point representation of the location
               const point = `POINT(${data.longitude} ${data.latitude})`;

               // Insert the new location into the Location table
               const result = await prisma.$queryRaw<{ id: string }[]>`
                  INSERT INTO "Location" 
                     (country_code, country_name, postal_code, coordinates, created_at, updated_at)
                  VALUES 
                     (${data.countryCode}, ${data.countryName}, ${data.postalCode}, ST_GeomFromText(${point}, 4326), NOW(), NOW())
                  RETURNING id`;

               // Return the created location with the id
               const location: Location = {
                  id: result[0]?.id || "",
                  countryCode: data.countryCode,
                  countryName: data.countryName,
                  postalCode: data.postalCode,
                  coordinates: {
                     latitude: data.latitude,
                     longitude: data.longitude,
                  },
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
               };
               return location;
            },

            async findSellersWithinDistance(
               latitude: number,
               longitude: number,
               distanceKm: number
            ) {
               // Convert distance to meters
               const distanceMeters = distanceKm * 1000;

               // Query for sellers within the specified distance
               const result = await prisma.$queryRaw<
                  {
                     sellerId: string;
                     userId: string;
                     locationId: string;
                     st_x: number;
                     st_y: number;
                     createdAt: string;
                     updatedAt: string;
                  }[]
               >`SELECT s.id AS sellerId, s.user_id AS userId, l.id AS locationId, 
                  ST_X(l.coordinates::geometry) AS st_x, ST_Y(l.coordinates::geometry) AS st_y,
                  s.created_at, s.updated_at
                 FROM "Seller" s
                 JOIN "Location" l ON s.locationId = l.id
                 WHERE ST_DistanceSphere(l.coordinates::geometry, ST_MakePoint(${longitude}, ${latitude})) <= ${distanceMeters}`;

               // Get the current timestamp for createdAt and updatedAt if they are missing
               const currentTimestamp = new Date().toISOString();

               // Transform to custom Seller type
               const sellers = result.map((data) => {
                  return {
                     id: data.sellerId,
                     userId: data.userId,
                     location: {
                        id: data.locationId,
                        coordinates: {
                           latitude: data.st_y || 0,
                           longitude: data.st_x || 0,
                        },
                     },
                     createdAt: new Date(data.createdAt).toISOString() || currentTimestamp,
                     updatedAt: new Date(data.updatedAt).toISOString() || currentTimestamp,
                  };
               });

               // Return the transformed data
               return sellers;
            },
         },
      },
   });
}

const prismaClientSingleton = () => {
   neonConfig.webSocketConstructor = ws;
   const pool = new Pool({ connectionString });
   const adapter = new PrismaNeon(pool);
   return extendPrismaClientWithLocation(new PrismaClient({ adapter }));
};

declare const globalThis: {
   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
