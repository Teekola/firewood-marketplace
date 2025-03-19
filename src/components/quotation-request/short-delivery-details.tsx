import { DeliveryMethod } from "@prisma/client";
import { useTranslations } from "next-intl";

export function ShortDeliveryDetails({
   deliveryMethods,
   deliveryCity,
   pickupCity,
}: Readonly<{
   deliveryMethods: DeliveryMethod[];
   deliveryCity?: string | null;
   pickupCity?: string | null;
}>) {
   const t = useTranslations();
   return (
      <p className="text-sm capitalize">
         {deliveryMethods
            .map((method) => {
               const methodTranslated = t(`delivery-methods.${method}`);
               if (method === DeliveryMethod.HOME_DELIVERY) {
                  return `${methodTranslated}${deliveryCity ? ` ${deliveryCity}` : ""}`;
               }
               return `${methodTranslated}${pickupCity ? ` ${pickupCity}` : ""}`;
            })
            .join(", ")}
      </p>
   );
}
