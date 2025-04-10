"use client";

import { ComponentProps } from "react";

import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { getSellerProfile } from "../profile/actions";
import { sellerProfileQueryKey } from "../profile/constants";

type SellerLocationSidebarNavIndicatorProps = ComponentProps<typeof AlertCircleIcon>;

export function isValidSellerProfile(
   sellerProfile: Awaited<ReturnType<typeof getSellerProfile>> | undefined
) {
   if (!sellerProfile) return false;

   if (!sellerProfile.email || !sellerProfile.name || !sellerProfile.phone) {
      return false;
   }

   return true;
}

export function SellerProfileSidebarNavIndicator({
   ...props
}: SellerLocationSidebarNavIndicatorProps) {
   const { data: sellerProfile, isFetching } = useQuery({
      queryKey: sellerProfileQueryKey,
      queryFn: getSellerProfile,
   });

   if (isFetching) return null;

   if (isValidSellerProfile(sellerProfile)) return null;

   return (
      <AlertCircleIcon
         {...props}
         className={cn("ml-auto h-5 w-5 stroke-destructive", props.className)}
      />
   );
}
