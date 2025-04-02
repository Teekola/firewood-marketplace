import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { Button } from "@/ui/button";

export default async function SubmittedPage({
   searchParams,
}: Readonly<{ searchParams: Promise<{ [key: string]: string | string[] | undefined }> }>) {
   const [sp, t] = await Promise.all([searchParams, getTranslations()]);
   const sellers = Number(sp.sellers) || 0;

   return (
      <div className="grid h-full place-items-center text-center">
         <div className="flex flex-col items-center gap-6">
            <h1 className="h1 text-center">{t("request-offers.Quotation Request Submitted")} </h1>

            <p className="text-muted-foreground">
               {t("request-offers.The quotation request was successfully submitted")}{" "}
               {t("request-offers.request sent to n sellers", { n: sellers })}{" "}
               {t(
                  "request-offers.When new sellers register in your area they will also receive your request"
               )}
            </p>

            <Button asChild variant="default" size="lg" className="mt-6 w-full xs:w-fit">
               <Link href="/dashboard/buyer/quotation-requests">{t("Go to Dashboard")}</Link>
            </Button>
         </div>
      </div>
   );
}
