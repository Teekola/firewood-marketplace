import { getTranslations } from "next-intl/server";

import { getSellerLocation } from "./actions";
import { SellerLocationForm } from "./location-form";

export default async function SellerInformationPage() {
   const [t, sellerLocation] = await Promise.all([
      getTranslations("dashboard"),
      getSellerLocation(),
   ]);

   return (
      <div>
         <header>
            <h1 className="h3">{t("Seller Location")}</h1>
            <p className="mt-2">
               {t("Define location settings These affect the offers you receive")}
            </p>
         </header>

         <SellerLocationForm sellerLocation={sellerLocation} />
      </div>
   );
}
