import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth/auth";

import { RegisterButton } from "../auth/register-button";
import { SignInButton } from "../auth/sign-in-button";
import { LanguageDropdown } from "../language-dropdown";
import { DashboardButton } from "./dashboard-button";
import { MobileContents } from "./mobile-contents";
import { Topbar } from "./topbar";

export async function WebsiteTopbar() {
   const session = await auth();
   return (
      <Topbar>
         <SessionProvider session={session}>
            <MobileContents />
         </SessionProvider>
         <DesktopContents />
      </Topbar>
   );
}

async function DesktopContents() {
   const session = await auth();
   return (
      <div className="hidden gap-2 sm:flex">
         <section className="hidden justify-between gap-1 sm:flex">
            <LanguageDropdown />
         </section>
         <section className="flex justify-end gap-2">
            {!session && <SignInButton variant="outline" />}
            {!session && <RegisterButton />}
            {session && <DashboardButton />}
         </section>
      </div>
   );
}
