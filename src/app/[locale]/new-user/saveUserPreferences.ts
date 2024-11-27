"use server";

import { Plan } from "@prisma/client";

import { updateUserById } from "@/app/db/user";
import { signIn } from "@/auth/auth";

import { NewUserFormData } from "./new-user-form";

interface Params extends NewUserFormData {
   userId: string;
}
export async function saveUserPreferences({ registerAsSeller, unitSystem, userId }: Params) {
   console.log(registerAsSeller, unitSystem, userId);

   const updatedUser = await updateUserById({
      id: userId,
      data: {
         preferredUnitSystem: unitSystem,
         isRegistered: true,
         buyer: {
            connectOrCreate: {
               create: {},
               where: { userId },
            },
         },
         ...(registerAsSeller && {
            seller: {
               connectOrCreate: {
                  create: {
                     plan: Plan.FREE,
                  },
                  where: {
                     userId,
                  },
               },
            },
         }),
      },
   });
   await signIn();
   return updatedUser;
}
