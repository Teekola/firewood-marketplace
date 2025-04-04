"use server";

import { Plan } from "@prisma/client";

import { updateUserById } from "@/db/user";
import { auth } from "@/lib/auth/auth";

export async function addSellerToUser() {
   const session = await auth();

   if (!session) throw new Error("Unauthorized.");

   await updateUserById({
      id: session?.user.id,
      data: {
         seller: {
            create: {
               plan: Plan.FREE,
            },
         },
      },
   });
}
