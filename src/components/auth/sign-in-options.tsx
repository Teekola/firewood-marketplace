"use client";

import { useSearchParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/routing";
import { CALLBACK_URL_KEY } from "@/lib/auth/constants";

import { GoogleSignInButton } from "./google-sign-in-button";

export function SignInOptions() {
   const t = useTranslations();
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const newSearchParams = new URLSearchParams(searchParams);
   newSearchParams.append(CALLBACK_URL_KEY, pathname);
   return (
      <div className="flex flex-col gap-4 text-center">
         <div>
            <GoogleSignInButton />
         </div>
         <p className="mt-4 text-sm">
            {t("auth.or")}{" "}
            <Link
               href={{ pathname: "/auth/sign-in/email", query: newSearchParams.toString() }}
               className="underline"
            >
               {t("auth.sign in with email")}
            </Link>
         </p>
      </div>
   );
}
