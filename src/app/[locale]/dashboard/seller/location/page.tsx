import { getTranslations } from "next-intl/server";

export default async function SellerInformationPage() {
   const t = await getTranslations("dashboard");
   return (
      <div>
         <header>
            <h1 className="h3">{t("Seller Location")}</h1>
            <p className="mt-2">
               {t("Define location settings These affect the offers you receive")}
            </p>
         </header>
      </div>
   );
}
