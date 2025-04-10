import { getTranslations } from "next-intl/server";

import { SidebarNavProps } from "../_components/sidebar-nav";
import { QuotationRequestSidebarNavIndicator } from "./_components/quotation-request-sidebar-nav-indicator/quotation-request-sidebar-nav-indicator";
import { SellerLocationSidebarNavIndicator } from "./_components/seller-location-sidebar-nav-indicator";
import { SellerProfileSidebarNavIndicator } from "./_components/seller-profile-sidebar-nav-indicator";
import { SentOffersSidebarNavIndicator } from "./_components/sent-offers-sidebar-nav-indicator/sent-offers-sidebar-nav-indicator";

export async function getSidebarNavItems() {
   const t = await getTranslations("dashboard");

   const sidebarNavItems: SidebarNavProps["items"] = [
      {
         title: t("Overview"),
         href: ["/dashboard/seller", "/dashboard/seller/dashboard"],
      },
      {
         title: t("Profile"),
         href: "/dashboard/seller/profile",
         indicator: <SellerProfileSidebarNavIndicator />,
      },
      {
         title: t("Location"),
         href: "/dashboard/seller/location",
         indicator: <SellerLocationSidebarNavIndicator />,
      },
      {
         title: t("Quotation Requests"),
         href: "/dashboard/seller/quotation-requests",
         indicator: <QuotationRequestSidebarNavIndicator />,
      },
      {
         title: t("Sent Offers"),
         href: "/dashboard/seller/offers",
         indicator: <SentOffersSidebarNavIndicator />,
      },
   ];
   return sidebarNavItems;
}
