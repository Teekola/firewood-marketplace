import { PrismaAdapter } from "@auth/prisma-adapter";
import { AdapterUser } from "next-auth/adapters";

import { prismaEdge } from "@/lib/prisma/prismaEdge";

import { UnitSystemT } from "./auth-options";

export interface CustomAdapterUser extends AdapterUser {
   name?: string;
   image?: string;
   preferredUnitSystem?: UnitSystemT;
   isRegistered: boolean;
}

export function ExtendedPrismaAdapter(prismaClient: typeof prismaEdge) {
   const adapter = PrismaAdapter(prismaClient);

   return {
      ...adapter,
      getUser: async (id: string) => {
         const user = await prismaClient.user.findUnique({
            where: { id },
            select: {
               id: true,
               name: true,
               email: true,
               emailVerified: true,
               image: true,
               preferredUnitSystem: true,
               isRegistered: true,
            },
         });

         if (!user) return null;

         return user as CustomAdapterUser;
      },
   };
}
