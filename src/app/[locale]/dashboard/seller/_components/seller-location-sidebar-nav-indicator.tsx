"use client";

import { ComponentProps } from "react";

import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { getSellerLocation } from "../location/actions";
import { sellerLocationQueryKey } from "../location/constants";

type SellerLocationSidebarNavIndicatorProps = ComponentProps<typeof AlertCircleIcon>;

export function isValidSellerLocation(
   sellerLocation: Awaited<ReturnType<typeof getSellerLocation>> | undefined
) {
   if (!sellerLocation) return false;

   if (
      !sellerLocation.countryCode ||
      !sellerLocation.countryName ||
      !sellerLocation.postalCode ||
      !sellerLocation.city ||
      !sellerLocation.maxDistanceKm ||
      !sellerLocation.coordinates ||
      !sellerLocation.coordinates.latitude ||
      !sellerLocation.coordinates.longitude
   ) {
      return false;
   }
   return true;
}

export function SellerLocationSidebarNavIndicator({
   ...props
}: SellerLocationSidebarNavIndicatorProps) {
   const { data: sellerLocation, isFetching } = useQuery({
      queryKey: sellerLocationQueryKey,
      queryFn: getSellerLocation,
   });

   if (isFetching) return null;

   if (isValidSellerLocation(sellerLocation)) return null;

   return (
      <AlertCircleIcon
         {...props}
         className={cn("ml-auto h-5 w-5 stroke-destructive", props.className)}
      />
   );
}
