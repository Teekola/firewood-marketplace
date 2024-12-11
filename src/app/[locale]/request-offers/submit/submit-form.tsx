"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { useUser } from "@/components/auth/user-store-provider";
import { BackButtonLink } from "@/components/back-button-link";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { useRouter } from "@/i18n/routing";
import { cubicFeetToCubicMeters, inchesToCentimeters } from "@/lib/utils/unit-conversions";

import { FormStoreSyncManager } from "../(components)/form-store-sync-manager";
import { stepToPath } from "../(components)/use-step-manager";
import { ContactData } from "../contact/contact-form";
import { DeliveryData } from "../delivery/delivery-form";
import { FirewoodData } from "../firewood/firewood-form";
import {
   useClearRequestOffersStore,
   useContactData,
   useDeliveryData,
   useFirewoodData,
   useSetSubmitData,
   useSubmitData,
   useValidSteps,
} from "../store/request-offers-store-provider";
import { submitQuotationRequest } from "./actions";

const ADDITIONAL_INFORMATION_MAX_LENGTH = 450;
export const submitFormSchema = z.object({
   additionalInformation: z.string().max(ADDITIONAL_INFORMATION_MAX_LENGTH).optional(),
});

export type SubmitData = z.infer<typeof submitFormSchema>;

export function SubmitForm() {
   const submitData = useSubmitData();
   const firewoodData = useFirewoodData();
   const deliveryData = useDeliveryData();
   const contactData = useContactData();
   const validSteps = useValidSteps();
   const clearStorage = useClearRequestOffersStore();
   const user = useUser();

   const defaultValues: DefaultValues<SubmitData> = submitData ?? {
      additionalInformation: "",
   };

   const form = useForm<SubmitData>({
      resolver: zodResolver(submitFormSchema),
      defaultValues,
   });

   const t = useTranslations("request-offers");
   const router = useRouter();

   const setSubmitData = useSetSubmitData();

   async function onSubmit(data: SubmitData) {
      // TODO: Display loading state!

      setSubmitData(data);

      // Validate that all steps are valid and redirect to first invalid step if not
      if (validSteps.size < 3) {
         for (const step of [1, 2, 3]) {
            if (!validSteps.has(step)) {
               const pathname = stepToPath[step];
               router.push(pathname);
               return;
            }
         }
      }
      // We can assert this because of the validation done above
      const fData = { ...firewoodData, maxLength: firewoodData?.maxLength ?? "" } as FirewoodData;
      const dData = deliveryData as DeliveryData;
      const cData = contactData as ContactData;

      const isImperial = user.preferredUnitSystem === "IMPERIAL";
      // convert to metric values if they were inputted as imperial system values
      if (isImperial) {
         fData.amount = cubicFeetToCubicMeters(Number(fData.amount));

         if (fData?.maxLength) {
            fData.maxLength = inchesToCentimeters(Number(fData.maxLength));
         }
      }

      console.log("Total submitted values", {
         firewoodData,
         deliveryData,
         contactData,
         data,
      });

      // Create quotation request and send it to nearest sellers
      const { numberOfSellers } = await submitQuotationRequest({
         firewoodData: fData,
         deliveryData: dData,
         contactData: cData,
         submitData: data,
      });
      console.log("Number of sellers:", numberOfSellers);
      clearStorage();
      // TODO: Change to correct redirect page / display success message etc.
      router.push("/");
   }

   const canProceed = form.formState.isValid && validSteps.size === 3;

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col justify-between"
         >
            <FormField
               name="additionalInformation"
               control={form.control}
               render={({ field }) => (
                  <FormItem className="w-full">
                     <FormLabel>{t("Additional information Optional")}</FormLabel>
                     <FormControl>
                        <AutosizeTextarea
                           {...field}
                           placeholder={t("Type special wishes or other useful information")}
                           maxLength={450}
                           minHeight={80}
                           maxHeight={90}
                        />
                     </FormControl>
                     <FormDescription>
                        {t("Maximum length")} {ADDITIONAL_INFORMATION_MAX_LENGTH} {t("characters")}
                     </FormDescription>

                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="flex gap-2">
               <BackButtonLink size="lg" href="/request-offers/contact" label={t("Back")} />
               <Button type="submit" size="lg" className="group w-full" data-disabled={!canProceed}>
                  <SendHorizonalIcon className="mr-4 h-4 w-4 transition-transform group-hover:translate-x-2" />{" "}
                  {t("Submit")}
               </Button>
            </div>
         </form>
         <FormStoreSyncManager
            formData={submitData}
            setFormDataToStore={setSubmitData}
            defaultValues={defaultValues}
         />
      </Form>
   );
}
