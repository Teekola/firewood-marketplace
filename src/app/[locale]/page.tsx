import { getTranslations } from "next-intl/server";

import { AuthButton } from "@/components/auth/auth-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/routing";
import { Button } from "@/ui/button";

export default async function Home() {
   const t = await getTranslations();
   return (
      <div>
         <div>
            <ThemeToggle />
         </div>
         <AuthButton />
         <Button asChild>
            <Link href="/secret-page">{t("home.Go to a secret page")}</Link>
         </Button>
      </div>
   );
}
