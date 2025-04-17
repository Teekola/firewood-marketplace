import { getSellerLocation } from "./actions";
import { SellerLocationForm } from "./location-form";

export default async function SellerInformationPage() {
   const sellerLocation = await getSellerLocation();
   return <SellerLocationForm sellerLocation={sellerLocation} />;
}
