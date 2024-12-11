import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";

type Coordinates = {
   latitude: number;
   longitude: number;
};

type SellerLocation = {
   id: string;
   sellerId: string;
   countryCode: string;
   countryName: string;
   postalCode: string;
   coordinates: Coordinates;
   createdAt: Date;
   updatedAt: Date;
};

type Seller = {
   seller_id: string;
   user_id: string;
   location_id: string;
   st_x: number;
   st_y: number;
   created_at: string;
   updated_at: string;
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
               latitude: number;
               longitude: number;
            }) {
               const point = `POINT(${data.longitude} ${data.latitude})`;

               const now = new Date();
               const id = createId(); // This is necessary because prisma could not automatically generate the cuid

               const result = await prisma.$queryRaw<{ id: string }[]>`
                  INSERT INTO "SellerLocation"
                     (id, seller_id, country_code, country_name, postal_code, coordinates, created_at, updated_at)
                  VALUES
                     (${id}, ${data.sellerId}, ${data.countryCode}, ${data.countryName}, ${data.postalCode}, ST_GeomFromText(${point}, 4326), ${now}, ${now})
                  RETURNING id`;

               // Return the created location with the id
               const location: SellerLocation = {
                  id: result[0]?.id || "",
                  sellerId: data.sellerId,
                  countryCode: data.countryCode,
                  countryName: data.countryName,
                  postalCode: data.postalCode,
                  coordinates: {
                     latitude: data.latitude,
                     longitude: data.longitude,
                  },
                  createdAt: new Date(),
                  updatedAt: new Date(),
               };
               // TODO: Remove debug
               console.log("Created", location);
               return location;
            },

            async findSellersWithinDistance({
               latitude,
               longitude,
            }: {
               latitude: number;
               longitude: number;
            }) {
               // const point = `'POINT(${longitude} ${latitude})'`;
               const result = await prisma.$queryRaw<Seller>`
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
                  "SellerLocation" l
                  ON s.id = l.seller_id
               WHERE
                  ST_DistanceSphere(l.coordinates::geometry, ST_MakePoint(${longitude}, ${latitude})) <= (s.max_distance_km * 1000);
               `;

               // Transform to custom Seller type
               const sellers = result.map((data) => {
                  return {
                     id: data.seller_id,
                     userId: data.user_id,
                     sellerLocation: {
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

               return sellers;
            },
         },
      },
   });
}
