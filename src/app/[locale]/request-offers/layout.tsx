import { getTranslations } from "next-intl/server";

import { AbandonRequestDialog } from "./(components)/abandon-request-dialog";

export default async function RequestOffersLayout({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   const t = await getTranslations();

   return (
      <div>
         <p className="text-base text-muted-foreground">{t("request-offers.Request Offers")}</p>
         {children}

         <AbandonRequestDialog />
      </div>
   );
}
