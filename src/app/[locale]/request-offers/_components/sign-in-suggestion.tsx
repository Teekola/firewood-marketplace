import { getTranslations } from "next-intl/server";

import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { auth } from "@/lib/auth/auth";

export async function SignInSuggestion() {
   const session = await auth();
   const t = await getTranslations("auth");

   if (session) return null;
   return (
      <p className="my-2 text-sm">
         {t("Already have an account")}
         {"? "}
         <SignInDialog
            trigger={<span className="cursor-pointer underline">{t("Sign In")}</span>}
         />{" "}
         {t("to fill in the details")}
      </p>
   );
}
