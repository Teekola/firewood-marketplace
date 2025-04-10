import { getTranslations } from "next-intl/server";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { auth } from "@/lib/auth/auth";

import { Submitter } from "./_components/submitter";

export default async function SubmittedPage() {
   const [session, t] = await Promise.all([auth(), getTranslations("request-offers")]);

   if (!session) {
      return (
         <SignInDialog
            open={!session}
            signInTitle={t("Sign in to submit")}
            registerTitle={t("Register to submit")}
         />
      );
   }

   return (
      <div className="grid h-full place-items-center">
         <Submitter />
      </div>
   );
}
