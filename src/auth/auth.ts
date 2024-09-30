import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { authConfig } from "@/auth/auth-config";
import { prismaEdge } from "@/prismaEdge";

export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: PrismaAdapter(prismaEdge),
   ...authConfig,
});
