import { Suspense } from "react";

import { getTranslations } from "next-intl/server";

import { SellerProfileForm } from "./seller-profile-form";

export default async function ProfileTemplate({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   const t = await getTranslations();
   return (
      <div>
         <header>
            <h1 className="h1 md:h3">{t("dashboard.Seller Profile")}</h1>
            <p className="mt-2">
               {t(
                  "dashboard.Define contact information that potential buyers receive upon accepting an offer"
               )}
            </p>
         </header>
         <Suspense fallback={<SellerProfileForm isLoading />}>{children}</Suspense>
      </div>
   );
}
