"use client";

import { useEffect } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function Error({
   error,
   reset,
}: Readonly<{
   error: Error & { digest?: string };
   reset: () => void;
}>) {
   const t = useTranslations("Error");

   useEffect(() => {
      // TODO: Log the error to an error reporting service
      console.error(error);
   }, [error]);

   return (
      <div className="mx-auto my-4 flex flex-col gap-4">
         <h1 className="h1">{t("request-offers.root-error-title")}</h1>
         <p className="text-sm text-foreground-muted">
            {t("request-offers.root-error-description")}
         </p>
         <Button onClick={reset}>{t("actions.Refresh")}</Button>
      </div>
   );
}
