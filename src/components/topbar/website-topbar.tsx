import { auth } from "@/auth/auth";

import { RegisterButton } from "../auth/register-button";
import { SignInButton } from "../auth/sign-in-button";
import { LanguageDropdown } from "../language-dropdown";
import { DashboardButton } from "./dashboard-button";
import { Topbar } from "./topbar";

export async function WebsiteTopbar() {
   const session = await auth();
   return (
      <Topbar>
         <div className="flex gap-2">
            <section className="flex justify-between gap-1">
               <LanguageDropdown />
            </section>
            <section className="flex justify-end gap-2">
               {!session && <SignInButton variant="outline" />}
               {!session && <RegisterButton />}
               {session && <DashboardButton />}
            </section>
         </div>
      </Topbar>
   );
}
