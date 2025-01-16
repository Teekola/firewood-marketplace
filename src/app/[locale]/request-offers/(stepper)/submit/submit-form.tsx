"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

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

import { FormStoreSyncManager } from "../../(components)/form-store-sync-manager";
import {
   useSetSubmitData,
   useSubmitData,
   useValidSteps,
} from "../../(store)/request-offers-store-provider";

const ADDITIONAL_INFORMATION_MAX_LENGTH = 450;
export const submitFormSchema = z.object({
   additionalInformation: z.string().max(ADDITIONAL_INFORMATION_MAX_LENGTH).optional(),
});

export type SubmitData = z.infer<typeof submitFormSchema>;

export function SubmitForm() {
   const submitData = useSubmitData();

   const validSteps = useValidSteps();

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
      setSubmitData(data);
      router.push("/request-offers/submitting");
   }

   const canProceed = form.formState.isValid && validSteps.size === 3;

   return (
      <>
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
                           {t("Maximum length")} {ADDITIONAL_INFORMATION_MAX_LENGTH}{" "}
                           {t("characters")}
                        </FormDescription>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <div className="flex gap-2">
                  <BackButtonLink size="lg" href="/request-offers/contact" label={t("Back")} />
                  <Button
                     type="submit"
                     size="lg"
                     className="group w-full"
                     data-disabled={!canProceed}
                  >
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
      </>
   );
}
