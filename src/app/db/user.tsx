import "server-only";

import { Prisma } from "@prisma/client";

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

export const getUserById = async (id: string) => {
   const user = await prisma.user.findUnique({
      where: { id },
      select: userDTOFields,
   });

   if (!user) return null;

   return createUserDTO(user);
};
