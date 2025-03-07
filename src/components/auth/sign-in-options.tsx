import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";

import { GoogleSignInButton } from "./google-sign-in-button";

export async function SignInOptions() {
   const t = await getTranslations();
   return (
      <div className="flex flex-col gap-4 text-center">
         <div>
            <GoogleSignInButton />
         </div>
         <p className="mt-4 text-sm">
            {t("auth.or")}{" "}
            <Link href="/auth/sign-in/email" className="underline">
               {t("auth.sign in with email")}
            </Link>
         </p>
      </div>
   );
}
