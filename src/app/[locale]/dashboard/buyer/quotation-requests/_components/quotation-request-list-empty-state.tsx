import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export function QuotationRequestListEmptyState() {
   const t = useTranslations();
   return (
      <div className="flex flex-col items-center gap-4">
         <p className="text-sm text-foreground-muted">{t("buyer.No pending quotation requests")}</p>
         <Button asChild>
            <Link href="/request-offers/firewood">{t("request-offers.Request Offers")}</Link>
         </Button>
      </div>
   );
}
