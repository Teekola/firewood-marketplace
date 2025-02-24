import { getActiveOffersForSeller } from "../quotation-requests/actions";

export default async function SellerQuotationRequestsPage() {
   const offers = await getActiveOffersForSeller();
   return (
      <div className="w-full">
         {offers.map((offer) => (
            <p key={offer.id}>{offer.price}</p>
         ))}
      </div>
   );
}
