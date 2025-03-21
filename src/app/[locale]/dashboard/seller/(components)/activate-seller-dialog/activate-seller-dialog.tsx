"use client";

import { ComponentProps, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Link, useRouter } from "@/i18n/routing";

import { isValidSellerLocation } from "../../../(components)/seller-location-sidebar-nav-indicator";
import { isValidSellerProfile } from "../../../(components)/seller-profile-sidebar-nav-indicator";
import { getSellerLocation } from "../../location/actions";
import { sellerLocationQueryKey } from "../../location/constants";
import { getSellerProfile } from "../../profile/actions";
import { sellerProfileQueryKey } from "../../profile/constants";
import {
   sellerQuotationRequestsQueryKey,
   sellerUnseenQuotationRequestsQueryKey,
} from "../../quotation-requests/constants";
import { activateSeller } from "./actions";

type ActivateSellerDialogProps = ComponentProps<typeof AlertDialogTrigger>;

export function ActivateSellerDialog({ ...props }: ActivateSellerDialogProps) {
   const t = useTranslations();
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const queryClient = useQueryClient();

   const { data: sellerLocation } = useQuery({
      queryKey: sellerLocationQueryKey,
      queryFn: getSellerLocation,
   });
   const { data: sellerProfile } = useQuery({
      queryKey: sellerProfileQueryKey,
      queryFn: getSellerProfile,
   });
   const isInvalidSellerLocation = !isValidSellerLocation(sellerLocation);
   const isInvalidSellerProfile = !isValidSellerProfile(sellerProfile);

   async function handleActivateSeller() {
      setIsLoading(true);
      const activatedCount = await activateSeller();

      // TODO: Add toast
      console.log(activatedCount);
      queryClient.invalidateQueries({ queryKey: sellerUnseenQuotationRequestsQueryKey });
      queryClient.invalidateQueries({ queryKey: sellerQuotationRequestsQueryKey });
      router.refresh();
   }

   return (
      <AlertDialog>
         <AlertDialogTrigger {...props} asChild>
            <Button>{t("actions.Start receiving requests")}</Button>
         </AlertDialogTrigger>

         {(isInvalidSellerLocation || isInvalidSellerProfile) && (
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>{t("seller.fill-in-missing-information")}</AlertDialogTitle>
                  <AlertDialogDescription className="sr-only">
                     {t("seller.fill-in-missing-information")}
                  </AlertDialogDescription>
               </AlertDialogHeader>
               {isInvalidSellerLocation && (
                  <p className="flex items-center gap-2">
                     {t("activate-seller.Add missing location details")}
                     <AlertCircleIcon className="h-5 w-5 stroke-destructive" />
                  </p>
               )}
               {isInvalidSellerProfile && (
                  <p className="flex items-center gap-2">
                     {t("activate-seller.Add missing profile details")}
                     <AlertCircleIcon className="h-5 w-5 stroke-destructive" />
                  </p>
               )}
               <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                     <Button type="button" variant="outline" className="w-full">
                        {t("actions.Close")}
                     </Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                     <Button asChild className="w-full">
                        <Link
                           href={
                              isInvalidSellerLocation
                                 ? "/dashboard/seller/location"
                                 : "/dashboard/seller/profile"
                           }
                        >
                           {t("actions.Continue")}
                        </Link>
                     </Button>
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         )}
         {!isInvalidSellerLocation && !isInvalidSellerProfile && (
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>{t("actions.Start receiving requests")}</AlertDialogTitle>
                  <AlertDialogDescription>
                     {t("seller.start-receiving-requests-description")}
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter className="w-full justify-self-end sm:w-72">
                  <AlertDialogCancel asChild>
                     <Button type="button" variant="outline" className="w-full">
                        {t("actions.Cancel")}
                     </Button>
                  </AlertDialogCancel>

                  {!isLoading && (
                     <Button asChild className="w-full">
                        <AlertDialogAction onClick={handleActivateSeller}>
                           {t("actions.Start receiving requests")}
                        </AlertDialogAction>
                     </Button>
                  )}
                  {isLoading && <ButtonLoading className="w-full" />}
               </AlertDialogFooter>
            </AlertDialogContent>
         )}
      </AlertDialog>
   );
}
