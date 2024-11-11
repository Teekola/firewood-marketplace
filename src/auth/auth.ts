import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { getUserById } from "@/app/db/user";
import { authOptions } from "@/auth/auth-options";
import { prismaEdge } from "@/prismaEdge";

export const { auth, handlers, signIn, signOut } = NextAuth({
   adapter: PrismaAdapter(prismaEdge),
   session: { strategy: "jwt" },
   ...authOptions,
});

export async function authWithUser() {
   const session = await auth();
   const userId = session?.user.id;

   if (!userId) return null;

   return await getUserById(userId);
}
