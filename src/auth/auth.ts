import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next/types";

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { getServerSession } from "next-auth";

import { authOptions } from "@/auth/auth-options";
import { prismaEdge } from "@/prismaEdge";

// Use in server contexts
export function auth(
   ...args:
      | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
      | [NextApiRequest, NextApiResponse]
      | []
) {
   return getServerSession(...args, authOptions);
}

export default NextAuth({
   adapter: PrismaAdapter(prismaEdge),
   session: { strategy: "jwt" },
   ...authOptions,
});
