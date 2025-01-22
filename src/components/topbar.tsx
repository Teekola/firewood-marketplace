import { auth } from "@/auth/auth";
import { LanguageDropdown } from "@/components/language-dropdown/language-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";

import { RegisterButton } from "./auth/register-button";
import { SignInButton } from "./auth/sign-in-button";
import { SignOutButton } from "./auth/sign-out-button";
import { Logo } from "./logo";

export async function Topbar() {
   const session = await auth();
   return (
      <div className="bg-secondary">
         <div className="mx-auto flex max-w-screen-xl justify-between p-3">
            <Logo className="my-auto" />

            <div className="rounded bg-card"></div>
            <div className="flex gap-2">
               <section className="flex justify-between gap-1">
                  <ThemeToggle />
                  <LanguageDropdown />
               </section>
               <section className="flex justify-end gap-2">
                  {!session && <SignInButton variant="outline" />}
                  {!session && <RegisterButton />}
                  {session && <SignOutButton />}
               </section>
            </div>
         </div>
      </div>
   );
}
