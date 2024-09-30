import { useTranslations } from "next-intl";

import { signIn } from "@/auth";
import { Button } from "@/ui/button";

import { GoogleLogo } from "./google-logo";

export function SignInButton() {
   const t = useTranslations("auth");
   return (
      <form
         action={async () => {
            "use server";
            await signIn("google");
         }}
      >
         <Button type="submit" variant="outline" size="lg">
            <GoogleLogo className="mr-2" />
            {t("Sign in with Google")}
         </Button>
      </form>
   );
}
