import { auth } from "@/auth/auth";

import { SignInButton } from "../auth/sign-in-button";
import { LanguageDropdown } from "../language-dropdown";
import { Topbar } from "./topbar";

export async function RequestOffersTopbar() {
   const session = await auth();
   return (
      <Topbar>
         <div className="flex gap-2">
            <section className="flex justify-between gap-1">
               <LanguageDropdown />
            </section>
            {!session && <SignInButton variant="outline" />}
         </div>
      </Topbar>
   );
}
