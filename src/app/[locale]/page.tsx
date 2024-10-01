import { getTranslations } from "next-intl/server";

import { auth } from "@/auth/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default async function Home() {
   const session = await auth();
   const t = await getTranslations();

   return (
      <div>
         <div>
            <ThemeToggle />
         </div>
         {session && <SignOutButton />}
         {!session && (
            <Button asChild>
               <Link href="/auth/sign-in">{t("auth.Sign In")}</Link>
            </Button>
         )}
         <Button asChild>
            <Link href="/secret-page">{t("settings.preferences.Toggle theme")}</Link>
         </Button>
      </div>
   );
}
