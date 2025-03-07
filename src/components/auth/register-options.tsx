import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";

import { GoogleRegisterButton } from "./google-register-button";

export async function RegisterOptions() {
   const t = await getTranslations();
   return (
      <div className="flex flex-col gap-4 text-center">
         <div>
            <GoogleRegisterButton />
         </div>

         <p className="mt-4 text-sm">
            {t("auth.or")}{" "}
            <Link href="/auth/register/email" className="underline">
               {t("auth.register with email")}
            </Link>
         </p>
      </div>
   );
}
