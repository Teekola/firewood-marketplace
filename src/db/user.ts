import "server-only";

import { Prisma, UnitSystem } from "@prisma/client";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma/prisma";

const userDTOFields = Prisma.validator<Prisma.UserSelect>()({
   id: true,
   name: true,
   email: true,
   image: true,
   preferredUnitSystem: true,
   isRegistered: true,
});

export type UserDTO = Prisma.UserGetPayload<{ select: typeof userDTOFields }>;

function createUserDTO(user: UserDTO) {
   return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      preferredUnitSystem: user.preferredUnitSystem,
      isRegistered: user.isRegistered,
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

export const updateUserById = async ({
   id,
   data,
}: {
   id: string;
   data: Prisma.UserUpdateInput;
}) => {
   const session = await auth();
   if (!session) return null;

   const updatedUser = await prisma.user.update({
      where: { id },
      data,
   });

   // TODO: Decide how to deal with the error of user not found code P2025
   return createUserDTO(updatedUser);
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

export const getUserByUsername = async (username: string) => {
   const user = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] },
   });
   return user;
};

export const createUserAndAcceptTerms = async ({
   username,
   hashedPassword,
   preferredUnitSystem,
}: {
   username: string;
   hashedPassword: string;
   preferredUnitSystem: UnitSystem;
}) => {
   return await prisma.user.create({
      data: {
         username,
         email: username,
         password: hashedPassword,
         termsAcceptedAt: new Date(),
         preferredUnitSystem,
         buyer: {
            create: {},
         },
      },
   });
};
