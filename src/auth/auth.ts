import NextAuth from "next-auth";

import { authOptions } from "@/auth/auth-options";
import { getBuyerByUserId } from "@/db/buyer";
import { getSellerByUserId } from "@/db/seller";
import { prismaEdge } from "@/lib/prisma/prismaEdge";

import { ExtendedPrismaAdapter } from "./extended-prisma-adapter";

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
   adapter: ExtendedPrismaAdapter(prismaEdge),
   session: { strategy: "jwt" },
   ...authOptions,
});

export const authWithBuyer = async () => {
   const session = await auth();

   if (!session) return null;

   const buyer = await getBuyerByUserId(session.user.id);
   return { ...session, buyer };
};
export type SessionWithBuyer = Awaited<ReturnType<typeof authWithBuyer>>;

export const authWithSeller = async () => {
   const session = await auth();

   if (!session) return null;

   const seller = await getSellerByUserId(session.user.id);

   return { ...session, seller };
};
export type SessionWithSeller = Awaited<ReturnType<typeof authWithBuyer>>;

export const getAuthorizedSeller = async () => {
   const session = await authWithSeller();

   if (!session) {
      throw new Error("Unauthorized.");
   }

   if (!session.seller) {
      throw new Error("The user is not a seller.");
   }

   return { ...session, seller: session.seller };
};
