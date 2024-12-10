import { Pool, neonConfig } from "@neondatabase/serverless";
import { createId } from "@paralleldrive/cuid2";
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

type FindUniqueResult = {
   id: string;
   country_code: string;
   country_name: string;
   postal_code: string;
   st_x: number;
   st_y: number;
   created_at: string;
   updated_at: string;
}[];

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

               const now = new Date();
               const id = createId();

               // Insert the new location into the Location table
               const result = await prisma.$queryRaw<{ id: string }[]>`
                  INSERT INTO "Location" 
                     (id, country_code, country_name, postal_code, coordinates, created_at, updated_at)
                  VALUES 
                     (${id}, ${data.countryCode}, ${data.countryName}, ${data.postalCode}, ST_GeomFromText(${point}, 4326), ${now}, ${now})
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
               console.log("Created", location);
               return location;
            },

            async findUnique(data: { id?: string; postalCode?: string; countryCode?: string }) {
               // Build the query based on the provided parameters
               if (!data.id && (!data.postalCode || !data.countryCode)) {
                  throw new Error(
                     "Either 'id' or both 'postalCode' and 'countryCode' must be provided."
                  );
               }

               let result: FindUniqueResult;

               if (data.id) {
                  result = await prisma.$queryRaw<FindUniqueResult>`
                  SELECT 
                     id, 
                     country_code, 
                     country_name, 
                     postal_code, 
                     ST_X(coordinates::geometry) AS st_x, 
                     ST_Y(coordinates::geometry) AS st_y, 
                     created_at, 
                     updated_at
                  FROM "Location"
                  WHERE 
                     id = ${data.id}
                  LIMIT 1;
                  `;
               } else {
                  result = await prisma.$queryRaw<FindUniqueResult>`
                  SELECT 
                     id, 
                     country_code, 
                     country_name, 
                     postal_code, 
                     ST_X(coordinates::geometry) AS st_x, 
                     ST_Y(coordinates::geometry) AS st_y, 
                     created_at, 
                     updated_at
                  FROM "Location"
                  WHERE 
                     postal_code = ${data.postalCode} AND country_code = ${data.countryCode}
                  LIMIT 1;
                  `;
               }

               if (result.length === 0) {
                  return null;
               }

               // Transform the result into the Location type
               const location: Location = {
                  id: result[0].id,
                  countryCode: result[0].country_code,
                  countryName: result[0].country_name,
                  postalCode: result[0].postal_code,
                  coordinates: {
                     latitude: result[0].st_y,
                     longitude: result[0].st_x,
                  },
                  createdAt: new Date(result[0].created_at).toISOString(),
                  updatedAt: new Date(result[0].updated_at).toISOString(),
               };

               console.log("FoundUnique", location);

               return location;
            },

            async findSellersWithinDistance(latitude: number, longitude: number) {
               const result = await prisma.$queryRaw<
                  {
                     seller_id: string;
                     user_id: string;
                     location_id: string;
                     st_x: number;
                     st_y: number;
                     created_at: string;
                     updated_at: string;
                  }[]
               >`
               SELECT 
                  s.id AS seller_id, 
                  s.user_id AS user_id, 
                  l.id AS location_id, 
                  ST_X(l.coordinates::geometry) AS st_x, 
                  ST_Y(l.coordinates::geometry) AS st_y, 
                  s.created_at,
                  s.updated_at
               FROM 
                  "Seller" s
               JOIN 
                  "Location" l 
                  ON s.location_id = l.id
               WHERE 
                  ST_DistanceSphere(
                     l.coordinates::geometry, 
                     ST_MakePoint(${longitude}, ${latitude})
                  ) <= (s.max_distance_km * 1000);
               `;

               // Transform to custom Seller type
               const sellers = result.map((data) => {
                  return {
                     id: data.seller_id,
                     userId: data.user_id,
                     location: {
                        id: data.location_id,
                        coordinates: {
                           latitude: data.st_y || 0,
                           longitude: data.st_x || 0,
                        },
                     },
                     createdAt: new Date(data.created_at),
                     updatedAt: new Date(data.updated_at),
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
