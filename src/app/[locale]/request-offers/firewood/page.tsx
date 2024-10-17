import { getTranslations } from "next-intl/server";

export default async function FirewoodPage() {
   const t = await getTranslations();
   return (
      <div>
         <h1 className="text-4xl font-extrabold">{t("request-offers.Firewood")}</h1>
      </div>
   );
}
