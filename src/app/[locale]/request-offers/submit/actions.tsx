"use server";

import { DeliveryMethod, WoodDryness, WoodType } from "@prisma/client";

import { auth } from "@/auth/auth";
import { env } from "@/env/server";
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

   let location = await prisma.location.findUnique({
      postalCode: deliveryData.postalCode,
      countryCode: deliveryData.countryCode,
   });

   console.log("ACTIONS: location:", location);

   if (!location) {
      const locationDataArr = await (
         await fetch(
            `https://geocode.maps.co/search?country=${deliveryData.countryCode}&postalCode=${deliveryData.postalCode}&api_key=${env.GEOCODE_API_KEY}`
         )
      ).json();

      // TODO: Improve this case handling, TODO: Backup to the city search in case postalcode was not found!
      // TODO: Nicely return back to the form if the location is not usable etc.
      if (
         !locationDataArr ||
         !locationDataArr[0] ||
         !locationDataArr[0].lat ||
         !locationDataArr[0].lon
      ) {
         throw new Error("Location data was not found.");
      }

      const locationData = locationDataArr[0];
      console.log(locationData);

      const coordinates = {
         latitude: locationData.lat,
         longitude: locationData.lon,
      };
      try {
         const newLocation = await prisma.location.create({
            countryCode: deliveryData.countryCode,
            countryName: deliveryData.countryName,
            postalCode: deliveryData.postalCode,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
         });
         location = newLocation;
      } catch (error) {
         // TODO: log this to logger
         console.error(error);
         const newLocation = await prisma.location.findUnique({ postalCode: "", countryCode: "" });
         if (!newLocation) {
            // TODO: Improve error handling
            throw new Error("Could not create location, but location does not exist.");
         }

         location = newLocation;
      }
   }

   // Finds all sellers that have maxDistanceKm lower than the distance in km
   const sellers = await prisma.location.findSellersWithinDistance(
      location.coordinates.latitude,
      location.coordinates.longitude
   );

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
