"use client";

import { useEffect } from "react";

import { useUser } from "@/hooks/user-store";
import { useRouter } from "@/i18n/routing";
import { cubicFeetToCubicMeters, inchesToCentimeters } from "@/i18n/utils/unit-conversions";

import { ContactData } from "../../../(stepper)/contact/_components/contact-form";
import { DeliveryData } from "../../../(stepper)/delivery/_components/delivery-form";
import { FirewoodData } from "../../../(stepper)/firewood/_components/firewood-form";
import { SubmitData } from "../../../(stepper)/submit/_components/submit-form";
import {
   useClearRequestOffersStore,
   useContactData,
   useDeliveryData,
   useFirewoodData,
   useSubmitData,
   useValidSteps,
} from "../../../_store/request-offers-store-provider";
import { submitQuotationRequest } from "./actions";

export function useSubmitQuotationRequest() {
   const submitData = useSubmitData();
   const firewoodData = useFirewoodData();
   const deliveryData = useDeliveryData();
   const contactData = useContactData();
   const validSteps = useValidSteps();
   const clearStorage = useClearRequestOffersStore();
   const user = useUser();
   const router = useRouter();

   useEffect(() => {
      (async () => {
         // This both validates that the data is correct and prevents sending the data twice, as the store is cleared after sending!
         if (validSteps.size < 3) {
            return;
         }
         // We can assert this because of the validation done above
         const fData = {
            ...firewoodData,
            maxLength: firewoodData?.maxLength ?? "",
         } as FirewoodData;
         const dData = deliveryData as DeliveryData;
         const cData = contactData as ContactData;
         const sData = submitData as SubmitData;

         const isImperial = user.preferredUnitSystem === "IMPERIAL";
         // convert to metric values if they were inputted as imperial system values
         if (isImperial) {
            fData.amount = cubicFeetToCubicMeters(Number(fData.amount));

            if (fData?.maxLength) {
               fData.maxLength = inchesToCentimeters(Number(fData.maxLength));
            }
         } else {
            // convert possible commas in metric values to dots
            fData.amount = fData.amount.replace(/\,/g, ".");
            fData.maxLength = fData.maxLength.replace(/\,/g, ".");
         }

         // Create quotation request and send it to nearest sellers
         const { numberOfSellers } = await submitQuotationRequest({
            firewoodData: fData,
            deliveryData: dData,
            contactData: cData,
            submitData: sData,
         });

         clearStorage();
         history.replaceState(null, "", "/request-offers/submit"); // Prevent returning to this page through back button
         router.push({
            pathname: "/request-offers/submitted",
            query: { sellers: numberOfSellers },
         });
      })();
   }, [
      clearStorage,
      contactData,
      deliveryData,
      firewoodData,
      submitData,
      user.preferredUnitSystem,
      validSteps,
      router,
   ]);
}
