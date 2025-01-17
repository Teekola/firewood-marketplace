import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { getBuyerByUserId } from "@/app/db/buyer";
import { authOptions } from "@/auth/auth-options";
import { prismaEdge } from "@/prismaEdge";

export const { auth, handlers, signIn, signOut } = NextAuth({
   adapter: PrismaAdapter(prismaEdge),
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
