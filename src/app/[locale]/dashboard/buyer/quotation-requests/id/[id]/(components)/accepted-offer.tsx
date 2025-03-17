import { ComponentProps } from "react";

import { getTranslations } from "next-intl/server";

import { OfferDTO } from "@/app/db/offer";
import { OfferDetails } from "@/components/offer/offer-details";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

import { RejectOfferDialog } from "./reject-offer-dialog";

interface AcceptedOfferProps extends ComponentProps<typeof Card> {
   offer: OfferDTO;
}

export async function AcceptedOffer({ offer }: Readonly<AcceptedOfferProps>) {
   const t = await getTranslations();
   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-green-500">{t("offer.Accepted Offer")}</CardTitle>
            <CardDescription className="sr-only">{t("offer.Accepted Offer")}</CardDescription>
         </CardHeader>
         <CardContent className="text-sm">
            <OfferDetails offer={offer} showSellerDetails showAddress />
         </CardContent>
         <CardFooter>
            <RejectOfferDialog
               offerId={offer.id}
               quotationRequestId={offer.quotationRequestId}
               variant="secondary"
               isAcceptedOffer
            />
         </CardFooter>
      </Card>
   );
}
