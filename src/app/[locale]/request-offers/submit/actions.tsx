"use server";

import { getBuyerByUserId, updateNullBuyerData } from "@/app/db/buyer";
import { createQuotationRequest } from "@/app/db/quotation-request";
import { findSellersWithinDistance } from "@/app/db/seller-location";
import { auth } from "@/auth/auth";

import { ContactData } from "../contact/contact-form";
import { DeliveryData } from "../delivery/delivery-form";
import { FirewoodData } from "../firewood/firewood-form";
import { SubmitData } from "./submit-form";

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
   console.log("ACTIONS: Submitted");

   const session = await auth();
   if (!session) {
      throw new Error("Unauthorized.");
   }

   const sellersPromise = findSellersWithinDistance({
      longitude: deliveryData.longitude,
      latitude: deliveryData.latitude,
   });

   const buyerPromise = await getBuyerByUserId(session.user.id);

   const [sellers, buyer] = await Promise.all([sellersPromise, buyerPromise]);

   // TODO: Remove debug
   console.log("ACTIONS: sellers:", sellers);
   console.log("ACTIONS: buyer:", buyer);

   // TODO: Improve handling
   if (!buyer) throw new Error("User does not have buyerId");

   const updateBuyerPromise = updateNullBuyerData({
      id: buyer.id,
      currentData: buyer,
      deliveryData,
      contactData,
   });

   const quotationRequestPromise = createQuotationRequest({
      buyerId: buyer.id,
      sellerIds: sellers.map((seller) => seller.id),
      firewoodData,
      deliveryData,
      contactData,
      submitData,
   });

   const [quotationRequest, updatedBuyer] = await Promise.all([
      quotationRequestPromise,
      updateBuyerPromise,
   ]);

   // TODO: Remove debug, add observability logging
   console.log("ACTIONS: created quotation request:", quotationRequest);
   console.log("ACTIONS: number of sellers:", quotationRequest.sellers.length);
   console.log("ACTIONS: updated buyer:", updatedBuyer);

   // TODO: Send emails to the sellers

   return { numberOfSellers: quotationRequest.sellers.length };
   // To retrieve all quotationRequests for a seller in the dashboard
   //await prisma.quotationRequest.findMany({ where: { sellers: { some: { id: "" } } } });
}
