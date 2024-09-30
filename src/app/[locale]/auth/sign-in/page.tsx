import { useTranslations } from "next-intl";

import { SignInButton } from "@/components/auth/sign-in-button";

export default function SignInPage() {
   const t = useTranslations("auth");
   return (
      <div className="mx-auto flex h-screen max-w-screen-sm flex-col items-center justify-center gap-4">
         <h1 className="h2">{t("Sign In")}</h1>
         <SignInButton />
      </div>
   );
}
