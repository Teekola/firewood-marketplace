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
               const id = createId(); // This is necessary because prisma could not automatically generate the cuid
               const point = `POINT(${data.longitude} ${data.latitude})`;

               const result = await prisma.$queryRaw<
                  { id: string; created_at: string; updated_at: string }[]
               >`
                  INSERT INTO "SellerLocation"
                     (id, seller_id, country_code, country_name, postal_code, coordinates, created_at, updated_at)
                  VALUES
                     (${id}, ${data.sellerId}, ${data.countryCode}, ${data.countryName}, ${data.postalCode}, ST_GeomFromText(${point}, 4326), now(), now())
                  RETURNING id, created_at, updated_at`;

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
                  createdAt: new Date(result[0].created_at),
                  updatedAt: new Date(result[0].updated_at),
               };
               // TODO: Remove debug
               console.log("Created", location);
               return location;
            },
         },
      },
   });
}
