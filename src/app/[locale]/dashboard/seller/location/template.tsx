import { Suspense } from "react";

import { getTranslations } from "next-intl/server";

import { DashboardPageTemplate } from "../_components/dashboard-page-template";
import { SellerLocationForm } from "./location-form";

export default async function ProfileTemplate({
   children,
}: Readonly<{ children: React.ReactNode }>) {
   const t = await getTranslations();
   return (
      <DashboardPageTemplate
         title={t("dashboard.Seller Location")}
         description={t("dashboard.Define location settings These affect the offers you receive")}
      >
         <Suspense fallback={<SellerLocationForm isLoading />}>{children}</Suspense>
      </DashboardPageTemplate>
   );
}
