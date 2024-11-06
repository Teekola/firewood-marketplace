import { getTranslations } from "next-intl/server";

import { DeliveryForm } from "./delivery-form";

export default async function FirewoodPage() {
   const t = await getTranslations();
   return (
      <>
         <h1 className="text-4xl font-extrabold">{t("request-offers.Delivery")}</h1>
         <DeliveryForm />
      </>
   );
}
