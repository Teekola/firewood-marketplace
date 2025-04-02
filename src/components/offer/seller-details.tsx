import { OfferDTO } from "@/db/offer";

export function SellerDetails({ offer }: Readonly<{ offer: OfferDTO }>) {
   return (
      <>
         <p>{offer.seller?.profile?.name}</p>
         <p>{offer.seller?.profile?.email}</p>
         <p>{offer.seller?.profile?.phone}</p>
      </>
   );
}
