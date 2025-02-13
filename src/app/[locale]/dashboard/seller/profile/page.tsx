import { getTranslations } from "next-intl/server";

import { getSellerProfile } from "./actions";
import { SellerProfileForm } from "./seller-profile-form";

export default async function SellerInformationPage() {
   const [t, sellerProfile] = await Promise.all([getTranslations("dashboard"), getSellerProfile()]);
   return (
      <div>
         <header>
            <h1 className="h3">{t("Seller Profile")}</h1>
            <p className="mt-2">
               {t(
                  "Define contact information that potential buyers receive upon accepting an offer"
               )}
            </p>
         </header>
         <SellerProfileForm sellerProfile={sellerProfile} />
      </div>
   );
}
