import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { authOptions } from "@/auth/auth-options";
import { prismaEdge } from "@/prismaEdge";

export const { auth, handlers, signIn, signOut } = NextAuth({
   adapter: PrismaAdapter(prismaEdge),
   session: { strategy: "jwt" },
   ...authOptions,
});
