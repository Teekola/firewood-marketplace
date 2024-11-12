import "server-only";

import { Prisma } from "@prisma/client";

import { auth } from "@/auth/auth";
import { prisma } from "@/prisma";

const userDTOFields = Prisma.validator<Prisma.UserSelect>()({
   id: true,
   name: true,
   email: true,
   image: true,
});

export type UserDTO = Prisma.UserGetPayload<{ select: typeof userDTOFields }>;

function createUserDTO(user: UserDTO): UserDTO {
   return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
   };
}

const getUserById = async (id: string) => {
   const user = await prisma.user.findUnique({
      where: { id },
      select: userDTOFields,
   });

   if (!user) return null;

   return createUserDTO(user);
};

/**
 * Gets the authenticated user's data
 * @returns user object with UserDTO data or null if the user is not authenticated or if the user is not found
 */
export const getUser = async () => {
   const session = await auth();

   if (!session) {
      return null;
   }
   const userId = session.user.id;
   const user = await getUserById(userId);
   return user;
};
