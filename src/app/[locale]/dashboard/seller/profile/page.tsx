import { getSellerProfile } from "./actions";
import { SellerProfileForm } from "./seller-profile-form";

export default async function SellerInformationPage() {
   const sellerProfile = await getSellerProfile();
   return <SellerProfileForm sellerProfile={sellerProfile} />;
}
