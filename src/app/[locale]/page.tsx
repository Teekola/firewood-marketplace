import { getTranslations } from "next-intl/server";

import { AuthButton } from "@/components/auth/auth-button";
import { LanguageDropdown } from "@/components/language-dropdown/language-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/routing";
import { Button } from "@/ui/button";

export default async function Home() {
   const t = await getTranslations();
   return (
      <>
         <div className="bg-secondary">
            <div className="mx-auto flex max-w-screen-xl justify-between p-3">
               <div className="text-secondary-foreground-foreground my-auto text-2xl font-extrabold">
                  {"Klapitori"}
               </div>

               <div className="rounded bg-card"></div>
               <div className="flex">
                  <section className="flex justify-between gap-1">
                     <LanguageDropdown />
                     <ThemeToggle />
                  </section>
                  <section className="flex min-w-36 justify-end">
                     <AuthButton />
                  </section>
               </div>
            </div>
         </div>
         <main className="mx-auto max-w-screen-xl p-3">
            <Button asChild>
               <Link href="/secret-page">{t("home.Go to a secret page")}</Link>
            </Button>
         </main>
      </>
   );
}
