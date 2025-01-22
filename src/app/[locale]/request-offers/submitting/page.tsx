import { getTranslations } from "next-intl/server";

import { auth } from "@/auth/auth";
import { SignInDialog } from "@/components/auth/sign-in-dialog";

import { Submitter } from "./submitter";

export default async function SubmittedPage() {
   const session = await auth();
   const t = await getTranslations("request-offers");

   return (
      <>
         {!session && (
            <div>
               <SignInDialog
                  open={!session}
                  signInTitle={t("Sign in to submit")}
                  registerTitle={t("Register to submit")}
               />
            </div>
         )}
         {session && <Submitter />}
      </>
   );
}
