import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";

export default async function SecretPage() {
   const t = await getTranslations();
   return (
      <div>
         <h1 className="h1">{t("secret-page.title")}</h1>
         <Link href="/">{t("secret-page.Go to home page")}</Link>
      </div>
   );
}
