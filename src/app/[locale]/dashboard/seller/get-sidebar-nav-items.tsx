import { getTranslations } from "next-intl/server";

import { QuotationRequestSidebarNavIndicator } from "../(components)/quotation-request-sidebar-nav-indicator";
import { SellerLocationSidebarNavIndicator } from "../(components)/seller-location-sidebar-nav-indicator";
import { SellerProfileSidebarNavIndicator } from "../(components)/seller-profile-sidebar-nav-indicator";
import { SentOffersSidebarNavIndicator } from "../(components)/sent-offers-sidebar-nav-indicator";
import { SidebarNavProps } from "../(components)/sidebar-nav";

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
