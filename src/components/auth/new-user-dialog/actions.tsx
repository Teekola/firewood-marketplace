"use server";

import { Plan } from "@prisma/client";

import { prismaEdge } from "@/prismaEdge";

interface RegsiterUserArgs {
   userId: string;
   isSeller: boolean;
}

export async function registerUser({ userId, isSeller }: RegsiterUserArgs) {
   const updated = await prismaEdge.user.update({
      data: {
         isRegistered: true,
         // No need to create buyer here because it is done on auth-options when registering
         ...(isSeller && {
            seller: {
               create: {
                  plan: Plan.FREE, // Default Plan
               },
            },
         }),
      },
      where: { id: userId },
      select: {
         id: true,
      },
   });
   return updated;
}
