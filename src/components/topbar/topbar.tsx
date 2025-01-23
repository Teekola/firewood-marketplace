import { auth } from "@/auth/auth";
import { LanguageDropdown } from "@/components/language-dropdown/language-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/routing";

import { RegisterButton } from "../auth/register-button";
import { SignInButton } from "../auth/sign-in-button";
import { Logo } from "../logo";
import { DashboardButton } from "./dashboard-button";

export async function Topbar() {
   const session = await auth();

   return (
      <div className="bg-secondary">
         <div className="mx-auto flex max-w-screen-xl justify-between p-3">
            <Link href="/">
               <Logo className="my-auto hover:brightness-150" />
            </Link>

            <div className="rounded bg-card"></div>
            <div className="flex gap-2">
               <section className="flex justify-between gap-1">
                  <ThemeToggle />
                  <LanguageDropdown />
               </section>
               <section className="flex justify-end gap-2">
                  {!session && <SignInButton variant="outline" />}
                  {!session && <RegisterButton />}
                  {session && <DashboardButton />}
               </section>
            </div>
         </div>
      </div>
   );
}
