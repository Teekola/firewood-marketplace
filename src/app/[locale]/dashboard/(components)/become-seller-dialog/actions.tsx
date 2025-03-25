"use server";

import { Plan } from "@prisma/client";

import { updateUserById } from "@/app/db/user";
import { auth } from "@/auth/auth";

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
