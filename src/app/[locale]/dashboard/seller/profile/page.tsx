import { getTranslations } from "next-intl/server";

export default async function SellerInformationPage() {
   const t = await getTranslations("dashboard");
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
      </div>
   );
}
