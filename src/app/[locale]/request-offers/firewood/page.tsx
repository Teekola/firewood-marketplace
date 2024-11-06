import { getTranslations } from "next-intl/server";

import { FirewoodForm } from "./firewood-form";

export default async function FirewoodPage() {
   const t = await getTranslations();
   return (
      <>
         <h1 className="text-4xl font-extrabold">{t("request-offers.Firewood")}</h1>
         <FirewoodForm />
      </>
   );
}
