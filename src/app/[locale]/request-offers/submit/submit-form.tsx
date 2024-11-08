"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

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

import { FormStoreSyncManager } from "../(components)/form-store-sync-manager";
import { stepToPath } from "../(components)/use-step-manager";
import {
   useClearRequestOffersStore,
   useContactData,
   useDeliveryData,
   useFirewoodData,
   useSetSubmitData,
   useSubmitData,
   useValidSteps,
} from "../store/request-offers-store-provider";

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

   function onSubmit(data: SubmitData) {
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

      console.log("Total submitted values", {
         firewoodData,
         deliveryData,
         contactData,
         data,
      });
      // TODO: Store to database
      // TODO: Change to correct redirect page
      clearStorage();
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

            <Button type="submit" size="lg" className="w-full" data-disabled={!canProceed}>
               {t("Submit")}
            </Button>
         </form>
         <FormStoreSyncManager
            formData={submitData}
            setFormDataToStore={setSubmitData}
            defaultValues={defaultValues}
         />
      </Form>
   );
}
