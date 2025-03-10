"use client";

import { useSearchParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

import { GoogleRegisterButton } from "./google-register-button";

export function RegisterOptions() {
   const t = useTranslations();
   const searchParams = useSearchParams();
   return (
      <div className="flex flex-col gap-4 text-center">
         <div>
            <GoogleRegisterButton />
         </div>

         <p className="mt-4 text-sm">
            {t("auth.or")}{" "}
            <Link
               href={{
                  pathname: "/auth/register/email",
                  query: searchParams.toString(),
               }}
               className="underline"
            >
               {t("auth.register with email")}
            </Link>
         </p>
      </div>
   );
}
