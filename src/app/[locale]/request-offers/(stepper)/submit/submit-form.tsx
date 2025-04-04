"use client";

import { ComponentProps } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { BackButtonLink } from "@/components/ui/back-button-link";
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
import { cn } from "@/lib/utils";

import { FormStoreSyncManager } from "../../(components)/form-store-sync-manager";
import { StickyFooter } from "../../(components)/sticky-footer";
import {
   useSetSubmitData,
   useSubmitData,
   useValidSteps,
} from "../../(store)/request-offers-store-provider";
import { Preview } from "./preview";

const ADDITIONAL_INFORMATION_MAX_LENGTH = 450;
export const submitFormSchema = z.object({
   additionalInformation: z.string().max(ADDITIONAL_INFORMATION_MAX_LENGTH).optional(),
});

export type SubmitData = z.infer<typeof submitFormSchema>;

export function SubmitForm({ ...props }: Readonly<ComponentProps<"form">>) {
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
      if (!canProceed) return;
      setSubmitData(data);
      router.push("/request-offers/submitting");
   }

   const canProceed = form.formState.isValid && validSteps.size === 3;

   return (
      <>
         <Form {...form}>
            <form
               {...props}
               onSubmit={form.handleSubmit(onSubmit)}
               className={cn(
                  "flex h-full flex-col justify-between",
                  props.className && props.className
               )}
            >
               <div className="flex flex-col gap-6">
                  <Preview />
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
               </div>

               <StickyFooter>
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
               </StickyFooter>
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
