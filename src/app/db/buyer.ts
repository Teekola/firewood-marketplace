import "server-only";

import { prisma } from "@/prisma";

import { ContactData } from "../[locale]/request-offers/(stepper)/contact/contact-form";
import { DeliveryData } from "../[locale]/request-offers/(stepper)/delivery/delivery-form";

export async function getBuyerByUserId(userId: string) {
   return await prisma.buyer.findUnique({
      where: { userId: userId },
      select: {
         id: true,
         name: true,
         email: true,
         phone: true,
         countryCode: true,
         countryName: true,
         postalCode: true,
         city: true,
         address: true,
         companyName: true,
         longitude: true,
         latitude: true,
      },
   });
}

export async function updateNullBuyerData({
   id,
   currentData,
   deliveryData,
   contactData,
}: {
   id: string;
   currentData: NonNullable<Awaited<ReturnType<typeof getBuyerByUserId>>>;
   deliveryData: DeliveryData;
   contactData: ContactData;
}) {
   const {
      name,
      email,
      phone,
      countryCode,
      countryName,
      postalCode,
      city,
      longitude,
      latitude,
      address,
      companyName,
   } = currentData;
   const updated = await prisma.buyer.update({
      where: { id },
      data: {
         ...(countryCode === null && { countryCode: deliveryData.countryCode }),
         ...(countryName === null && { countryName: deliveryData.countryName }),
         ...(postalCode === null && { postalCode: deliveryData.postalCode }),
         ...(city === null && { city: deliveryData.city }),
         ...(longitude === null && { longitude: deliveryData.longitude }),
         ...(latitude === null && { latitude: deliveryData.latitude }),
         ...(address === null && deliveryData.address && { address: deliveryData.address }),
         ...(name === null && { name: contactData.name }),
         ...(email === null && { email: contactData.email }),
         ...(phone === null && { phone: contactData.phone }),
         ...(companyName === null &&
            contactData.companyName && { companyName: contactData.companyName }),
      },
   });
   return updated;
}
