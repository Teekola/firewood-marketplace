"use server";

import { getBuyerByUserId, updateNullBuyerData } from "@/db/buyer";
import { createQuotationRequest } from "@/db/quotation-request";
import { findSellersWithinDistance } from "@/db/seller-location";
import { authWithSeller } from "@/lib/auth/auth";

import { ContactData } from "../(stepper)/contact/contact-form";
import { DeliveryData } from "../(stepper)/delivery/delivery-form";
import { FirewoodData } from "../(stepper)/firewood/firewood-form";
import { SubmitData } from "../(stepper)/submit/submit-form";

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

   const session = await authWithSeller();
   if (!session) {
      throw new Error("Unauthorized.");
   }

   const sellersPromise = findSellersWithinDistance({
      deliveryMethods: deliveryData.deliveryMethods,
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

   // Ensure that the request is not sent to the buyer (they could also be a seller)
   const currentSellerId = session?.seller?.id;

   // Filter out the current seller's id and convert to string array of ids
   const sellerIds = sellers.reduce((ids, seller) => {
      if (seller.id !== currentSellerId) {
         ids.push(seller.id);
      }
      return ids;
   }, [] as string[]);

   const quotationRequestPromise = createQuotationRequest({
      sellerIds,
      buyerId: buyer.id,
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
   console.log("ACTIONS: created quotation request:", quotationRequest.id);
   console.log("ACTIONS: number of sellers:", quotationRequest.sellerQuotationRequestCount);
   console.log("ACTIONS: updated buyer:", updatedBuyer);

   // TODO: Send emails to the sellers

   return { numberOfSellers: quotationRequest.sellerQuotationRequestCount };
}
