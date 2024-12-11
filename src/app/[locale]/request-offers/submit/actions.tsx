"use server";

import { DeliveryMethod, WoodDryness, WoodType } from "@prisma/client";

import { auth } from "@/auth/auth";
import { prisma } from "@/prisma";

import { ContactData } from "../contact/contact-form";
import { DeliveryData } from "../delivery/delivery-form";
import { FirewoodData } from "../firewood/firewood-form";
import { SubmitData } from "./submit-form";

const toEnum = {
   mixed: WoodType.MIXED,
   birch: WoodType.BIRCH,
   pine: WoodType.PINE,
   any: WoodDryness.ANY,
   dry: WoodDryness.DRY,
   green: WoodDryness.GREEN,
   homeDelivery: DeliveryMethod.HOME_DELIVERY,
   pickup: DeliveryMethod.PICKUP,
} as const;

export async function submitQuotationRequest({
   firewoodData,
   deliveryData,
   contactData,
   submitData,
}: {
   firewoodData: FirewoodData;
   deliveryData: DeliveryData;
   contactData: ContactData;
   submitData: SubmitData;
}) {
   console.log("Submitted");
   const session = await auth();
   if (!session) {
      throw new Error("Unauthorized.");
   }

   // Finds all sellers that have maxDistanceKm lower than the distance in km
   const sellers = await prisma.sellerLocation.findSellersWithinDistance({
      latitude: deliveryData.latitude,
      longitude: deliveryData.longitude,
   });

   console.log("ACTIONS: sellers:", sellers);

   const buyer = await prisma.buyer.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
   });

   console.log("ACTIONS: buyer:", buyer);

   if (!buyer) throw new Error("User does not have buyerId");

   // Create the quotation request
   const quotationRequest = await prisma.quotationRequest.create({
      data: {
         buyerId: buyer.id,
         sellers: {
            connect: sellers.map((seller) => ({ id: seller.id })),
         },
         woodType: toEnum[firewoodData.woodType],
         woodDryness: toEnum[firewoodData.dryness],
         ...(firewoodData.maxLength && { woodMaxLengthCm: Number(firewoodData.maxLength) }),
         woodAmountCubicMeters: Number(firewoodData.amount),
         deliveryMethod: toEnum[deliveryData.deliveryMethod],
         countryCode: deliveryData.countryCode,
         countryName: deliveryData.countryName,
         postalCode: deliveryData.postalCode,
         city: deliveryData.city,
         ...(deliveryData.address && { address: deliveryData.address }),
         buyerName: contactData.name,
         buyerEmail: contactData.email,
         buyerPhone: contactData.phone,
         ...(contactData.isCompany && { buyerCompanyName: contactData.companyName }),
         ...(submitData.additionalInformation && {
            additionalInformation: submitData.additionalInformation,
         }),
      },
      // TODO: Remove when tested
      select: {
         id: true,
         buyer: true,
         sellers: true,
      },
   });

   console.log(quotationRequest);

   // To retrieve all quotationRequests for a seller in the dashboard
   //await prisma.quotationRequest.findMany({ where: { sellers: { some: { id: "" } } } });
}
